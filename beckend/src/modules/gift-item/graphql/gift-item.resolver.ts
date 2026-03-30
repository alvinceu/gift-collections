import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Resolver } from '@nestjs/graphql';
import { GiftItemService } from '../gift-item.service';
import { GiftItemType } from './gift-item.type';
import { CreateGiftItemInput, UpdateGiftItemInput } from './gift-item.input';
import { GqlAuthGuard } from '../../../common/guards/gql-auth.guard';
import { GqlCurrentUser } from '../../../common/decorators/gql-current-user.decorator';
import { CollectionItemsAuthorGuard } from '../../../common/guards/collection-items-author.guard';

@Resolver(() => GiftItemType)
export class GiftItemResolver {
  constructor(private readonly giftItemService: GiftItemService) {}

  @Mutation(() => GiftItemType)
  @UseGuards(GqlAuthGuard, CollectionItemsAuthorGuard)
  createGiftItem(
    @Args('collectionId', { type: () => ID }) collectionId: string,
    @Args('input') input: CreateGiftItemInput,
    @GqlCurrentUser() user: { id: string },
  ) {
    return this.giftItemService.create(collectionId, input, user.id);
  }

  @Mutation(() => GiftItemType)
  @UseGuards(GqlAuthGuard, CollectionItemsAuthorGuard)
  updateGiftItem(
    @Args('collectionId', { type: () => ID }) collectionId: string,
    @Args('itemId', { type: () => ID }) itemId: string,
    @Args('input') input: UpdateGiftItemInput,
    @GqlCurrentUser() user: { id: string },
  ) {
    return this.giftItemService.update(collectionId, itemId, input, user.id);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard, CollectionItemsAuthorGuard)
  async deleteGiftItem(
    @Args('collectionId', { type: () => ID }) collectionId: string,
    @Args('itemId', { type: () => ID }) itemId: string,
    @GqlCurrentUser() user: { id: string },
  ) {
    await this.giftItemService.delete(collectionId, itemId, user.id);
    return true;
  }
}
