import { ConfigLibService } from '@lib/config';
import { JwtPayload } from '@lib/jwt/types';
import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { readFileSync } from 'fs';
import { ExtractJwt, Strategy } from 'passport-jwt';
import path from 'path';

const publicKey = readFileSync(
  path.resolve(__dirname, './../../../../jwt_rsa/jwtRS256.key.pub')
);

const logger = new Logger('RtStrategy');

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private configService: ConfigLibService) {
    super({
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          let refreshToken: string | undefined;

          //! From Header (Mobile and Web SSR)
          //? try to get token from header
          //? authorization header will available on SSG or SSR (Server side)
          const refreshTokenHeader =
            request.headers[this.configService.env.REFRESH_TOKEN_KEY];
          if (refreshTokenHeader) {
            refreshToken = refreshTokenHeader as string;
            if (refreshToken) {
              logger.debug(
                `Got ${this.configService.env.REFRESH_TOKEN_KEY} from SSR/SSG headers`
              );
            }
          }
          //! From Cookie (Web client only)
          //? try to get token from cookies
          //? cookies will available on Browser (Client side)
          else {
            refreshToken =
              request?.cookies[this.configService.env.REFRESH_TOKEN_KEY];
            if (refreshToken) {
              logger.debug(
                `Got ${this.configService.env.REFRESH_TOKEN_KEY} from Browser cookies`
              );
            }
          }

          return refreshToken;
        }
      ]),
      ignoreExpiration: false,
      // secretOrKey: configService.env.JWT_RT_SECRET,
      secretOrKey: publicKey,
      passReqToCallback: true
    });
  }

  async validate(req: Request, payload: JwtPayload): Promise<any> {
    const refreshToken =
      req.headers[this.configService.env.REFRESH_TOKEN_KEY] ||
      req.cookies[this.configService.env.REFRESH_TOKEN_KEY];

    return {
      ...payload,
      refreshToken
    };
  }
}
