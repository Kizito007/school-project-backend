import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AttendanceMgmtController } from './attedance-mgmt.controller';
import { AttendanceMgmtService } from './attendance-mgmt.service';
import { Attendance, AttendanceSchema } from './attendance-mgmt.schema';
import {
  Employee,
  EmployeeSchema,
} from '../employee-mgmt/employee-mgmt.schema';
import { NodeMailerService } from 'src/comms/nodemailer.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Attendance.name, schema: AttendanceSchema },
      { name: Employee.name, schema: EmployeeSchema },
    ]),
  ],
  controllers: [AttendanceMgmtController],
  providers: [AttendanceMgmtService, NodeMailerService],
})
export class AttendanceMgmtModule {}
