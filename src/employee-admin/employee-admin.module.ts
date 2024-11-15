import { Module } from '@nestjs/common';
import { DepartmentMgmtModule } from './department-mgmt/department-mgmt.module';
import { EmployeeMgmtModule } from './employee-mgmt/employee-mgmt.module';

@Module({
  imports: [DepartmentMgmtModule, EmployeeMgmtModule],
})
export class EmployeeAdminModule {}
