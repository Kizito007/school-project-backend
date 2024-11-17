import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FacesModule } from './faces/faces.module';
import { CommerceAdminModule } from './commerce-admin/commerce-admin.module';
import { EmployeeAdminModule } from './employee-admin/employee-admin.module';
import { SchoolAdminModule } from './school-admin/school-admin.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    MongooseModule.forRoot(`${process.env.MONGODB_URI}`),
    FacesModule,
    CommerceAdminModule,
    EmployeeAdminModule,
    SchoolAdminModule,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
