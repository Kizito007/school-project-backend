import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { CommerceUser, CommerceUserSchema } from '../users/users.schema';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { VerifyEmail, VerifyEmailSchema } from './verify-email.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CommerceUser.name, schema: CommerceUserSchema },
      { name: VerifyEmail.name, schema: VerifyEmailSchema },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_SECRET'),
        privateKey: configService.getOrThrow('JWT_SECRET'),
        signOptions: {
          expiresIn: '30d',
        },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy, UsersService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
