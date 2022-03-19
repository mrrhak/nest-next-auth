import {
  GqlAtGuard,
  GqlGetAccessToken,
  GqlGetCurrentUserId,
  GqlGetRefreshToken,
  GqlRtGuard
} from '@common';
import { UserModel } from '@graphql/user/dto/user.model';
import { ConfigLibService } from '@lib/config';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UseGuards
} from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CookieOptions } from 'express';
import { AuthService } from './auth.service';
import { LoginInput, RegisterInput } from './dto/auth.input.dto';
import { AuthModel } from './dto/auth.model.dto';

@Resolver(() => AuthModel)
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private configService: ConfigLibService
  ) {}

  private _setAuthCookies(ctx: any, authModel: AuthModel) {
    const isProduction = this.configService.env.NODE_ENV === 'production';
    const defaultCookieOptions: CookieOptions = {
      httpOnly: true,
      path: '/',
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax'
      // domain: '',
    };

    ctx.res.cookie(
      this.configService.env.ACCESS_TOKEN_KEY,
      `Bearer ${authModel.accessToken}`,
      {
        ...defaultCookieOptions,
        maxAge: Number(this.configService.env.ACCESS_TOKEN_EXPIRED)
      }
    );
    ctx.res.cookie(
      this.configService.env.REFRESH_TOKEN_KEY,
      authModel.refreshToken,
      {
        ...defaultCookieOptions,
        maxAge: Number(this.configService.env.REFRESH_TOKEN_EXPIRED)
      }
    );
  }

  private _clearAuthCookies(ctx: any) {
    ctx.res.clearCookie(this.configService.env.ACCESS_TOKEN_KEY);
    ctx.res.clearCookie(this.configService.env.REFRESH_TOKEN_KEY);
  }

  @Mutation(() => AuthModel)
  async register(
    @Args('input') input: RegisterInput,
    @Context() ctx: any
  ): Promise<AuthModel> {
    try {
      const authToken = await this.authService.register(input);
      this._setAuthCookies(ctx, authToken);
      return authToken;
    } catch (error: any) {
      if (error?.keyValue['username']) {
        throw new BadRequestException('Username already exists');
      } else if (error?.keyValue['email']) {
        throw new BadRequestException('Email already exists');
      } else {
        throw new BadRequestException('Something went wrong');
      }
    }
  }

  @Mutation(() => AuthModel)
  async login(
    @Args('input') input: LoginInput,
    @Context() ctx: any
  ): Promise<AuthModel> {
    const authToken = await this.authService.login(input);
    this._setAuthCookies(ctx, authToken);
    return authToken;
  }

  @UseGuards(GqlAtGuard)
  @Mutation(() => Boolean)
  async logout(
    @GqlGetCurrentUserId() userId: string,
    @GqlGetAccessToken() accessToken: string,
    @Context() ctx: any
  ): Promise<boolean> {
    this._clearAuthCookies(ctx);
    return await this.authService.logout(userId, accessToken);
  }

  @UseGuards(GqlRtGuard)
  @Mutation(() => AuthModel)
  async renewToken(
    @GqlGetCurrentUserId() userId: string,
    @GqlGetRefreshToken() refreshToken: string,
    @Context() ctx: any
  ): Promise<AuthModel> {
    try {
      const authToken = await this.authService.renewToken(userId, refreshToken);
      this._setAuthCookies(ctx, authToken);
      return authToken;
    } catch (error) {
      this._clearAuthCookies(ctx);
      throw new ForbiddenException('Refresh token is invalid');
    }
  }

  @UseGuards(GqlAtGuard)
  @Query(() => UserModel)
  async getAuthUser(@GqlGetCurrentUserId() userId: string): Promise<UserModel> {
    const authUser = await this.authService.getAuthUser(userId);
    if (!authUser) {
      throw new NotFoundException('User not found');
    }
    return authUser;
  }
}
