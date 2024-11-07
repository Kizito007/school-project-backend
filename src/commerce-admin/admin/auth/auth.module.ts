import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AdminLocalStrategy } from './admin-local.strategy';
import { PassportModule } from '@nestjs/passport';
import { AdminMgmtModule } from '../admin-mgmt/admin-mgmt.module';
import { CommerceAdmin, CommerceAdminSchema } from '../admin-mgmt/admin.schema';
import { AdminMgmtService } from '../admin-mgmt/admin-mgmt.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule,
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
    ]),
  ],
  controllers: [AuthController],
  providers: [AdminLocalStrategy, AdminMgmtService],
  exports: [],
})
export class AuthModule {}
