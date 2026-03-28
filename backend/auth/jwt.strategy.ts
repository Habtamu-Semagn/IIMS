import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'temporary-secret-key',
    });
  } // <--- This brace must close the constructor

  async validate(payload: any) {
    // Passport will attach this return value to the Request object as 'req.user'
    return payload;
  }
}
