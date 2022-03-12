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
  constructor(readonly configService: ConfigLibService) {
    super({
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          let refresh_token: string | undefined;

          //! From Header
          //? try to get token from header
          //? authorization header will available on SSG or SSR (Server side)
          if (request.headers.refresh_token) {
            refresh_token = request.headers.refresh_token as string;
            if (refresh_token) {
              logger.debug('Got refresh_token from SSR/SSG headers');
            }
          }
          //! From Cookie
          //? try to get token from cookies
          //? cookies will available on Browser (Client side)
          else {
            refresh_token = request?.cookies['refresh_token'];
            if (refresh_token) {
              logger.debug('Got refresh_token from Browser cookies');
            }
          }

          return refresh_token;
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
      req.headers.refresh_token || req.cookies['refresh_token'];

    return {
      ...payload,
      refreshToken
    };
  }
}
