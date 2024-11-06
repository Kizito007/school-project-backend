import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CommerceUser, CommerceUserSchema } from './users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CommerceUser.name, schema: CommerceUserSchema },
    ]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.getOrThrow<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.getOrThrow('JWT_EXPIRES_IN'),
          },
        };
      },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
