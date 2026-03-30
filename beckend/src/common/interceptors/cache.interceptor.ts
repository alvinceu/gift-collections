import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, of, tap } from 'rxjs';

interface CacheEntry {
  data: any;
  expiresAt: number;
}

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private readonly logger = new Logger('CacheInterceptor');
  private readonly cache = new Map<string, CacheEntry>();
  private readonly ttl = 30_000;

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const contextType = context.getType<string>();

    if (contextType === 'http') {
      const req = context.switchToHttp().getRequest();
      if (req.method !== 'GET') return next.handle();

      const key = `rest:${req.url}`;
      return this.handleCache(key, next);
    }

    if (contextType === 'graphql') {
      const { GqlExecutionContext } = require('@nestjs/graphql');
      const gqlCtx = GqlExecutionContext.create(context);
      const info = gqlCtx.getInfo();

      if (info.parentType.name !== 'Query') return next.handle();

      const args = gqlCtx.getArgs();
      const key = `gql:${info.fieldName}:${JSON.stringify(args)}`;
      return this.handleCache(key, next);
    }

    return next.handle();
  }

  private handleCache(key: string, next: CallHandler): Observable<any> {
    const cached = this.cache.get(key);

    if (cached && cached.expiresAt > Date.now()) {
      this.logger.debug(`Cache HIT: ${key}`);
      return of(cached.data);
    }

    this.logger.debug(`Cache MISS: ${key}`);

    return next.handle().pipe(
      tap((data) => {
        this.cache.set(key, {
          data,
          expiresAt: Date.now() + this.ttl,
        });
      }),
    );
  }

  invalidate() {
    this.cache.clear();
    this.logger.debug('Cache invalidated');
  }
}
