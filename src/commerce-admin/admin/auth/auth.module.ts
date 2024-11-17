import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AdminLocalStrategy } from './admin-local.strategy';
import { PassportModule } from '@nestjs/passport';
import { AdminMgmtModule } from '../admin-mgmt/admin-mgmt.module';
import { CommerceAdmin, CommerceAdminSchema } from '../admin-mgmt/admin.schema';
import { AdminMgmtService } from '../admin-mgmt/admin-mgmt.service';
import { ConfigService } from '@nestjs/config';
import { CloudinaryModule } from 'src/config/cloudinary.module';
import { FilesService } from 'src/files/files.service';
import {
  FaceCompareToken,
  FaceCompareTokenSchema,
} from 'src/faces/face-compare.schema';
import { HttpModule } from '@nestjs/axios';
import { FacesService } from 'src/faces/faces.service';
import { AuthService } from './auth.service';
import { MailgunService } from 'src/comms/mailgun.service';
import {
  VerifyEmail,
  VerifyEmailSchema,
} from 'src/commerce-admin/auth/verify-email.schema';

@Module({
  imports: [
    PassportModule,
    CloudinaryModule,
    HttpModule,
    AdminMgmtModule,
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
    MongooseModule.forFeature([
      { name: CommerceAdmin.name, schema: CommerceAdminSchema },
      { name: FaceCompareToken.name, schema: FaceCompareTokenSchema },
      { name: VerifyEmail.name, schema: VerifyEmailSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AdminLocalStrategy,
    AuthService,
    AdminMgmtService,
    FilesService,
    FacesService,
    MailgunService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
