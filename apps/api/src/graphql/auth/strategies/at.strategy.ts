import { ConfigLibService } from '@lib/config';
import { JwtPayload } from '@lib/jwt/types';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(readonly configService: ConfigLibService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.env.JWT_AT_SECRET
    });
  }

  async validate(payload: JwtPayload): Promise<any> {
    return payload;
  }
}
