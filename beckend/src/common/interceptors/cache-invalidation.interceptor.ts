import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { CacheInterceptor } from './cache.interceptor';

@Injectable()
export class CacheInvalidationInterceptor implements NestInterceptor {
  constructor(private readonly cacheInterceptor: CacheInterceptor) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const contextType = context.getType<string>();
    let isMutation = false;

    if (contextType === 'http') {
      const req = context.switchToHttp().getRequest();
      isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
    }

    if (contextType === 'graphql') {
      const { GqlExecutionContext } = require('@nestjs/graphql');
      const gqlCtx = GqlExecutionContext.create(context);
      const info = gqlCtx.getInfo();
      isMutation = info.parentType.name === 'Mutation';
    }

    if (isMutation) {
      return next.handle().pipe(
        tap(() => this.cacheInterceptor.invalidate()),
      );
    }

    return next.handle();
  }
}
