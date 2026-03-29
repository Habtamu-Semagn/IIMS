// jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  // 'jwt' is the name
  constructor() {
    // jwt.strategy.ts
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'fallback', // <--- Add the exclamation mark here
    });
  }

  async validate(payload: any) {
    console.log('JWT Payload decoded successfully:', payload);
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
