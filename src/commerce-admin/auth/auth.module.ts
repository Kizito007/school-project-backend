import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { User, UserSchema } from '../users/users.schema';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { VerifyEmail, VerifyEmailSchema } from './verify-email.schema';
import { JwtStrategy } from './jwt.strategy';
import { MailgunService } from 'src/comms/mailgun.service';
import { CloudinaryModule } from 'src/config/cloudinary.module';
import { FilesService } from 'src/files/files.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: VerifyEmail.name, schema: VerifyEmailSchema },
    ]),
    UsersModule,
    PassportModule,
    CloudinaryModule,
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
  providers: [
    AuthService,
    LocalStrategy,
    UsersService,
    JwtStrategy,
    MailgunService,
    FilesService,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
