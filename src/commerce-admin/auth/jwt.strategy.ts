import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AdminRole } from '../admin/admin-mgmt/admin.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow('JWT_SECRET'),
    });
  }

  async validate(payload: {
    sub: string;
    email: string;
    emailVerified: boolean;
    role: AdminRole | 'USER';
  }) {
    return {
      userId: payload.sub,
      email: payload.email,
      emailVerified: payload.emailVerified,
      role: payload.role || 'USER',
    };
  }
}
