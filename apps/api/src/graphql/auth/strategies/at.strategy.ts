import { ConfigLibService } from '@lib/config';
import { JwtPayload } from '@lib/jwt/types';
import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { readFileSync } from 'fs';
import path from 'path';

const publicKey = readFileSync(
  path.resolve(__dirname, './../../../../jwt_rsa/jwtRS256.key.pub')
);

const logger = new Logger('AtStrategy');
@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(readonly configService: ConfigLibService) {
    super({
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          let bearerToken: string | undefined;

          //! From Header
          //? try to get token from header
          //? authorization header will available on SSG or SSR (Server side)
          if (request.headers.authorization) {
            bearerToken = request.headers.authorization;
            if (bearerToken) {
              logger.debug('Got access_token from SSR/SSG headers');
            }
          }
          //! From Cookie
          //? try to get token from cookies
          //? cookies will available on Browser (Client side)
          else {
            bearerToken = request?.cookies['access_token'];
            if (bearerToken) {
              logger.debug('Got access_token from Browser cookies');
            }
          }

          if (!bearerToken) {
            return null;
          }
          const token = bearerToken.replace('Bearer ', '').trim();
          return token;
        }
      ]),
      ignoreExpiration: false,
      // secretOrKey: configService.env.JWT_AT_SECRET
      secretOrKey: publicKey
    });
  }

  async validate(payload: JwtPayload): Promise<any> {
    return payload;
  }
}
