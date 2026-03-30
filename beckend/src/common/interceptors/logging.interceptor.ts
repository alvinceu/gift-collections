import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('RequestLogger');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();

    const contextType = context.getType<string>();

    let requestInfo: string;

    if (contextType === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(context);
      const info = gqlCtx.getInfo();
      requestInfo = `GraphQL ${info.parentType.name}.${info.fieldName}`;
    } else {
      const req = context.switchToHttp().getRequest();
      requestInfo = `${req.method} ${req.url}`;
    }

    this.logger.log(`→ ${requestInfo}`);

    return next.handle().pipe(
      tap(() => {
        const elapsed = Date.now() - now;
        this.logger.log(`← ${requestInfo} — ${elapsed}ms`);
      }),
    );
  }
}
