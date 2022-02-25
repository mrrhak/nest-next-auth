import { ConfigLibService } from '@lib/config';
import { JwtPayload } from '@lib/jwt/types';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(readonly configService: ConfigLibService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.env.JWT_RT_SECRET,
      passReqToCallback: true
    });
  }

  async validate(req: Request, payload: JwtPayload): Promise<any> {
    const refreshToken = req.get('authorization').replace('Bearer ', '').trim();

    return {
      ...payload,
      refreshToken
    };
  }
}
