import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FacesModule } from './faces/faces.module';
import { CommerceAdminModule } from './commerce-admin/commerce-admin.module';
import { EmployeeAdminModule } from './employee-admin/employee-admin.module';
import { SchoolAdminModule } from './school-admin/school-admin.module';

@Module({
  imports: [FacesModule, CommerceAdminModule, EmployeeAdminModule, SchoolAdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
