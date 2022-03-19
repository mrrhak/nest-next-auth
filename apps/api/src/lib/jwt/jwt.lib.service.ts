import { ConfigLibService } from '@lib/config';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { readFileSync } from 'fs';
import path from 'path';
import { JwtPayload, Tokens } from './types';

const privateKey = readFileSync(
  path.resolve(__dirname, './../../../jwt_rsa/jwtRS256.key')
);

@Injectable()
export class JwtLibService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigLibService
  ) {}

  async getTokens(payload: JwtPayload): Promise<Tokens> {
    const { sub, roles } = payload;
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub, roles },
        {
          algorithm: 'RS256',
          privateKey,
          // secret: this.configService.env.JWT_AT_SECRET,
          expiresIn: this.configService.env.JWT_AT_EXPIRE
        }
      ),
      this.jwtService.signAsync(
        { sub },
        {
          algorithm: 'RS256',
          privateKey,
          // secret: this.configService.env.JWT_RT_SECRET,
          expiresIn: this.configService.env.JWT_RT_EXPIRE
        }
      )
    ]);
    return { accessToken, refreshToken };
  }
}
