import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class UserType {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  createdAt: string;
}

@ObjectType()
export class AuthResponseType {
  @Field()
  accessToken: string;

  @Field(() => UserType)
  user: UserType;
}
