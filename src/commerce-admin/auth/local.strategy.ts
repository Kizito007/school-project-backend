import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CommerceUser } from '../users/users.schema';

@Injectable()
export class LocalStrategy extends PassportStrategy(
  Strategy,
  'commerce-local',
) {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow('JWT_SECRET'),
    });
  }

  async validate(payload: { userId: string }): Promise<CommerceUser> {
    const user = await this.authService.validateUser(payload.userId);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    return user;
  }
}
