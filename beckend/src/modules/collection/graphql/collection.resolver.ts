import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CollectionService } from '../collection.service';
import { CollectionType } from './collection.type';
import { CreateCollectionInput, UpdateCollectionInput } from './collection.input';
import { GqlAuthGuard } from '../../../common/guards/gql-auth.guard';
import { GqlCurrentUser } from '../../../common/decorators/gql-current-user.decorator';
import { CollectionAuthorGuard } from '../../../common/guards/collection-author.guard';

@Resolver(() => CollectionType)
export class CollectionResolver {
  constructor(private readonly collectionService: CollectionService) {}

  @Query(() => [CollectionType])
  collections(
    @Args('search', { nullable: true }) search?: string,
    @Args('tags', { type: () => [String], nullable: true }) tags?: string[],
  ) {
    return this.collectionService.findAll(search, tags);
  }

  @Query(() => CollectionType)
  collection(@Args('id', { type: () => ID }) id: string) {
    return this.collectionService.findOne(id);
  }

  @Mutation(() => CollectionType)
  @UseGuards(GqlAuthGuard)
  createCollection(
    @Args('input') input: CreateCollectionInput,
    @GqlCurrentUser() user: { id: string; name: string },
  ) {
    return this.collectionService.create(input, user);
  }

  @Mutation(() => CollectionType)
  @UseGuards(GqlAuthGuard, CollectionAuthorGuard)
  updateCollection(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateCollectionInput,
    @GqlCurrentUser() user: { id: string },
  ) {
    return this.collectionService.update(id, input, user.id);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard, CollectionAuthorGuard)
  async deleteCollection(
    @Args('id', { type: () => ID }) id: string,
    @GqlCurrentUser() user: { id: string },
  ) {
    await this.collectionService.delete(id, user.id);
    return true;
  }
}
