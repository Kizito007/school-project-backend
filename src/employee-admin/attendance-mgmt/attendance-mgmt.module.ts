import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AttendanceMgmtController } from './attedance-mgmt.controller';
import { AttendanceMgmtService } from './attendance-mgmt.service';
import { Attendance, AttendanceSchema } from './attendance-mgmt.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Attendance.name, schema: AttendanceSchema },
    ]),
  ],
  controllers: [AttendanceMgmtController],
  providers: [AttendanceMgmtService],
})
export class AttendanceMgmtModule {}
