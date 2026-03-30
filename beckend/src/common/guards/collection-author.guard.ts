import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Repository } from 'typeorm';

import { Collection } from '../../models/collection.entity';

@Injectable()
export class CollectionAuthorGuard implements CanActivate {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
  ) {}

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
        return gqlCtx.getArgs()?.id;
      }
      const req = context.switchToHttp().getRequest();
      return req.params?.id;
    })();

    if (!collectionId) throw new ForbiddenException('Forbidden');

    const collection = await this.collectionRepository.findOne({
      where: { id: collectionId },
    });

    if (!collection) {
      throw new NotFoundException('Коллекция не найдена');
    }

    if (collection.authorId !== userId) {
      throw new ForbiddenException('Только автор может изменять эту коллекцию');
    }

    return true;
  }
}

