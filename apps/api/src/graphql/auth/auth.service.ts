import { UserService } from '@graphql/user/user.service';
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
    private readonly jwtService: JwtLibService
  ) {}

  async register(input: RegisterInput): Promise<AuthModel> {
    const user = await this.userService.createUser(input);
    const tokens: Tokens = await this.jwtService.getTokens(user.id);
    const hashRefreshToken = await this.hashService.hash(tokens.refreshToken);
    await this.userService.update({
      id: user.id,
      refreshToken: hashRefreshToken
    });

    return tokens;
  }

  async login(input: LoginInput): Promise<Tokens> {
    const user = await this.userService.model.findOne({
      $or: [
        { email: input.usernameOrEmail },
        { username: input.usernameOrEmail }
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

    const tokens: Tokens = await this.jwtService.getTokens(user.id);
    const hashRefreshToken = await this.hashService.hash(tokens.refreshToken);
    await this.userService.update({
      id: user.id,
      refreshToken: hashRefreshToken
    });
    return tokens;
  }

  async logout(userId: string): Promise<boolean> {
    const user = await this.userService.findOne({ id: userId });
    if (!user || !user.refreshToken) {
      throw new ForbiddenException();
    }

    await this.userService.update({ id: userId, refreshToken: null });
    return true;
  }

  async refreshToken(userId: string, rt: string): Promise<Tokens> {
    const user = await this.userService.findOne({ id: userId });
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Refresh token is invalid');
    }

    const isMatched = await this.hashService.isMatch(rt, user.refreshToken);
    if (!isMatched) throw new ForbiddenException('Refresh token is invalid');

    const tokens: Tokens = await this.jwtService.getTokens(user.id);
    const hashRefreshToken = await this.hashService.hash(tokens.refreshToken);
    await this.userService.update({
      id: user.id,
      refreshToken: hashRefreshToken
    });
    return tokens;
  }
}
