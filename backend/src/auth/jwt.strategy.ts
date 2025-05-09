// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract token from the Authorization header
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || '123', // Use your secret from environment variables
    });
  }

  async validate(payload: any) {
    // The returned object is attached to req.user
    return { userId: payload.userId, name: payload.name, email: payload.email };
  }
}
