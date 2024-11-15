import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { EmployeeMgmtController } from './employee-mgmt.controller';
import { EmployeeMgmtService } from './employee-mgmt.service';
import { Employee, EmployeeSchema } from './employee-mgmt.schema';
import { FacesService } from 'src/faces/faces.service';
import {
  FaceCompareToken,
  FaceCompareTokenSchema,
} from 'src/faces/face-compare.schema';
import { FilesService } from 'src/files/files.service';
import { CloudinaryModule } from 'src/config/cloudinary.module';

@Module({
  imports: [
    CloudinaryModule,
    HttpModule,
    MongooseModule.forFeature([
      { name: Employee.name, schema: EmployeeSchema },
      { name: FaceCompareToken.name, schema: FaceCompareTokenSchema },
    ]),
  ],
  controllers: [EmployeeMgmtController],
  providers: [EmployeeMgmtService, FacesService, FilesService],
})
export class EmployeeMgmtModule {}