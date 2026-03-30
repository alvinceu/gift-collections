import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType()
export class GiftItemType {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  image: string;

  @Field(() => Float)
  price: number;

  @Field()
  currency: string;

  @Field()
  description: string;

  @Field(() => [String])
  tags: string[];

  @Field()
  link: string;

  @Field()
  createdAt: string;
}
