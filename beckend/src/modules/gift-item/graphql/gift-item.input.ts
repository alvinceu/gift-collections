import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class CreateGiftItemInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  image?: string;

  @Field(() => Float)
  price: number;

  @Field()
  currency: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [String], { nullable: true })
  tags?: string[];

  @Field({ nullable: true })
  link?: string;
}

@InputType()
export class UpdateGiftItemInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  image?: string;

  @Field(() => Float, { nullable: true })
  price?: number;

  @Field({ nullable: true })
  currency?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [String], { nullable: true })
  tags?: string[];

  @Field({ nullable: true })
  link?: string;
}
