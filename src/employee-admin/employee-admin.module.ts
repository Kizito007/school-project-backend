import { Module } from '@nestjs/common';
import { AttendanceMgmtModule } from './attendance-mgmt/attendance-mgmt.module';
import { EmployeeMgmtModule } from './employee-mgmt/employee-mgmt.module';

@Module({
  imports: [AttendanceMgmtModule, EmployeeMgmtModule],
})
export class EmployeeAdminModule {}
