import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfig } from '../../../../core/config/app.config';
import { JwtPayload } from '../contracts/jwt-payload.contract';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: AppConfig.jwt.secret,
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    return payload;
  }
}
