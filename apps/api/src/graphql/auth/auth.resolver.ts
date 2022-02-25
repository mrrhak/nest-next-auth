import {
  GqlAtGuard,
  GqlGetCurrentUser,
  GqlGetCurrentUserId,
  GqlRtGuard
} from '@common';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignInInput, SignUpInput } from './dto/auth.input.dto';
import { AuthModel } from './dto/auth.model.dto';

@Resolver(() => AuthModel)
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthModel)
  async signUp(@Args('input') input: SignUpInput): Promise<AuthModel> {
    try {
      return this.authService.signUp(input);
    } catch (error: any) {
      if (error.keyValue['username']) {
        throw new BadRequestException('Username already exists');
      } else if (error.keyValue['email']) {
        throw new BadRequestException('Email already exists');
      } else {
        throw new BadRequestException('Something went wrong');
      }
    }
  }

  @Mutation(() => AuthModel)
  async signIn(@Args('input') input: SignInInput): Promise<AuthModel> {
    return await this.authService.signIn(input);
  }

  @UseGuards(GqlAtGuard)
  @Mutation(() => Boolean)
  async signOut(@GqlGetCurrentUserId() userId: string): Promise<boolean> {
    return await this.authService.signOut(userId);
  }

  @UseGuards(GqlRtGuard)
  @Mutation(() => AuthModel)
  async refreshToken(
    @GqlGetCurrentUserId() userId: string,
    @GqlGetCurrentUser('refreshToken') refreshToken: string
  ): Promise<AuthModel> {
    return await this.authService.refreshToken(userId, refreshToken);
  }
}
