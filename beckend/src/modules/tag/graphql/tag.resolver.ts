import { UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TagService } from '../tag.service';
import { TagType } from './tag.type';
import { GqlAuthGuard } from '../../../common/guards/gql-auth.guard';

@Resolver(() => TagType)
export class TagResolver {
  constructor(private readonly tagService: TagService) {}

  @Query(() => [TagType])
  tags() {
    return this.tagService.findAll();
  }

  @Mutation(() => TagType)
  @UseGuards(GqlAuthGuard)
  createTag(@Args('name') name: string) {
    return this.tagService.create(name);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async removeTag(@Args('id', { type: () => ID }) id: string) {
    await this.tagService.remove(id);
    return true;
  }
}
