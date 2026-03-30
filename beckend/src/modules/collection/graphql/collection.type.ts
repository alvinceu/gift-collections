import { ObjectType, Field, ID } from '@nestjs/graphql';
import { GiftItemType } from '../../gift-item/graphql/gift-item.type';

@ObjectType()
export class CollectionType {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  authorId: string;

  @Field()
  authorName: string;

  @Field()
  coverImage: string;

  @Field(() => [String])
  tags: string[];

  @Field(() => [GiftItemType])
  items: GiftItemType[];

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}
