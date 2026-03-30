import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { CollectionService } from '../../modules/collection/collection.service';

@Injectable()
export class CollectionItemsAuthorGuard implements CanActivate {
  constructor(private readonly collectionService: CollectionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const contextType = context.getType<string>();

    const user = (() => {
      if (contextType === 'graphql') {
        const gqlCtx = GqlExecutionContext.create(context);
        return gqlCtx.getContext().req?.user;
      }
      const req = context.switchToHttp().getRequest();
      return req.user;
    })();

    const userId: string | undefined = user?.id;
    if (!userId) throw new ForbiddenException('Unauthorized');

    const collectionId: string | undefined = (() => {
      if (contextType === 'graphql') {
        const gqlCtx = GqlExecutionContext.create(context);
        return gqlCtx.getArgs()?.collectionId;
      }
      const req = context.switchToHttp().getRequest();
      return req.params?.collectionId;
    })();

    if (!collectionId) throw new ForbiddenException('Forbidden');

    const collection = await this.collectionService.findById(collectionId);

    if (collection.authorId !== userId) {
      throw new ForbiddenException('Только автор может изменять подарки в этой коллекции');
    }

    return true;
  }
}

