import {
  GqlAtGuard,
  GqlGetCurrentUser,
  GqlGetCurrentUserId,
  GqlRtGuard
} from '@common';
import { ConfigLibService } from '@lib/config';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignInInput, SignUpInput } from './dto/auth.input.dto';
import { AuthModel } from './dto/auth.model.dto';

@Resolver(() => AuthModel)
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private configService: ConfigLibService
  ) {}

  private _setAuthCookies(ctx: any, authModel: AuthModel) {
    ctx.res.cookie(
      this.configService.env.COOKIES_ACCESS_TOKEN_NAME,
      `Bearer ${authModel.accessToken}`,
      {
        httpOnly: true,
        maxAge: Number(this.configService.env.COOKIES_ACCESS_TOKEN_EXPIRED),
        path: '/',
        sameSite: 'strict',
        secure: true
      }
    );
    ctx.res.cookie(
      this.configService.env.COOKIES_REFRESH_TOKEN_NAME,
      authModel.refreshToken,
      {
        httpOnly: true,
        maxAge: Number(this.configService.env.COOKIES_REFRESH_TOKEN_EXPIRED),
        path: '/',
        sameSite: 'strict',
        secure: true
      }
    );
  }

  private _clearAuthCookies(ctx: any) {
    ctx.res.clearCookie(this.configService.env.COOKIES_ACCESS_TOKEN_NAME);
    ctx.res.clearCookie(this.configService.env.COOKIES_REFRESH_TOKEN_NAME);
  }

  @Mutation(() => AuthModel)
  async signUp(
    @Args('input') input: SignUpInput,
    @Context() ctx: any
  ): Promise<AuthModel> {
    try {
      const authToken = await this.authService.signUp(input);
      this._setAuthCookies(ctx, authToken);
      return authToken;
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
  async signIn(
    @Args('input') input: SignInInput,
    @Context() ctx: any
  ): Promise<AuthModel> {
    const authToken = await this.authService.signIn(input);
    this._setAuthCookies(ctx, authToken);
    return authToken;
  }

  @UseGuards(GqlAtGuard)
  @Mutation(() => Boolean)
  async signOut(
    @GqlGetCurrentUserId() userId: string,
    @Context() ctx: any
  ): Promise<boolean> {
    this._clearAuthCookies(ctx);
    return await this.authService.signOut(userId);
  }

  @UseGuards(GqlRtGuard)
  @Mutation(() => AuthModel)
  async refreshToken(
    @GqlGetCurrentUserId() userId: string,
    @GqlGetCurrentUser('refreshToken') refreshToken: string,
    @Context() ctx: any
  ): Promise<AuthModel> {
    const authToken = await this.authService.refreshToken(userId, refreshToken);
    this._setAuthCookies(ctx, authToken);
    return authToken;
  }
}
