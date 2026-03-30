import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from '../auth.service';
import { AuthResponseType, UserType } from './auth.type';
import { LoginInput, RegisterInput } from './auth.input';
import { GqlAuthGuard } from '../../../common/guards/gql-auth.guard';
import { GqlCurrentUser } from '../../../common/decorators/gql-current-user.decorator';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponseType)
  register(@Args('input') input: RegisterInput) {
    return this.authService.register(input);
  }

  @Mutation(() => AuthResponseType)
  login(@Args('input') input: LoginInput) {
    return this.authService.login(input);
  }

  @Query(() => UserType)
  @UseGuards(GqlAuthGuard)
  profile(@GqlCurrentUser() user: { id: string }) {
    return this.authService.getProfile(user.id);
  }
}
