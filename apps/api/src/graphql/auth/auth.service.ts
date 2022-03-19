import { SessionService } from '@graphql/session/session.service';
import { UserService } from '@graphql/user/user.service';
import { ConfigLibService } from '@lib/config';
import { HashLibService } from '@lib/hash';
import { JwtLibService } from '@lib/jwt';
import { Tokens } from '@lib/jwt/types';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { LoginInput, RegisterInput } from './dto/auth.input.dto';
import { AuthModel } from './dto/auth.model.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly hashService: HashLibService,
    private readonly sessionService: SessionService,
    private readonly jwtService: JwtLibService,
    private configService: ConfigLibService
  ) {}

  async register(input: RegisterInput): Promise<AuthModel> {
    const user = await this.userService.createUser({
      ...input,
      username: input.username.toLowerCase(),
      email: input.email.toLowerCase()
    });
    const tokens: Tokens = await this.jwtService.getTokens({
      sub: user.id,
      roles: user.roles
    });

    await this.sessionService.create({
      userId: user.id,
      expiredAt: new Date(
        new Date().getTime() +
          Number(this.configService.env.REFRESH_TOKEN_EXPIRED)
      ),
      ...tokens
    });

    return tokens;
  }

  async login(input: LoginInput): Promise<Tokens> {
    const user = await this.userService.model.findOne({
      $or: [
        { email: input.usernameOrEmail.toLowerCase() },
        { username: input.usernameOrEmail.toLowerCase() }
      ]
    });
    if (!user) {
      throw new ForbiddenException('Username or password is invalid');
    }

    const isMatched = await this.hashService.isMatch(
      input.password,
      user.password
    );
    if (!isMatched) {
      throw new ForbiddenException('Username or password is invalid');
    }

    const tokens: Tokens = await this.jwtService.getTokens({
      sub: user.id,
      roles: user.roles
    });

    await this.sessionService.create({
      userId: user.id,
      expiredAt: new Date(
        new Date().getTime() +
          Number(this.configService.env.REFRESH_TOKEN_EXPIRED)
      ),
      ...tokens
    });

    return tokens;
  }

  async logout(userId: string, accessToken: string): Promise<boolean> {
    const user = await this.userService.findOne({ id: userId });

    if (user) {
      await this.sessionService.deleteByAccessToken(accessToken);
    }
    return true;
  }

  async renewToken(userId: string, rt: string): Promise<Tokens> {
    const [user, session] = await Promise.all([
      //! Validate user
      this.userService.findOne({ id: userId }),
      //! Validate session
      this.sessionService.findByRefreshToken(rt)
    ]);
    if (!user) throw new ForbiddenException('User no longer available');
    if (!session) throw new ForbiddenException('Session expired');

    const tokens: Tokens = await this.jwtService.getTokens({
      sub: user.id,
      roles: user.roles
    });
    await Promise.all([
      //! Delete old session
      await this.sessionService.deleteByRefreshToken(rt),
      //! Create new session
      await this.sessionService.create({
        userId: user.id,
        expiredAt: new Date(
          new Date().getTime() +
            Number(this.configService.env.REFRESH_TOKEN_EXPIRED)
        ),
        ...tokens
      })
    ]);

    return tokens;
  }

  async getAuthUser(id: string): Promise<any> {
    return await this.userService.getUser({ id });
  }
}
