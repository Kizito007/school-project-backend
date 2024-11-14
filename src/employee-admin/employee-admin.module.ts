import { Module } from '@nestjs/common';
import { DepartmentMgmtModule } from './department-mgmt/department-mgmt.module';
import { UserMgmtModule } from './user-mgmt/user-mgmt.module';

@Module({
  imports: [DepartmentMgmtModule, UserMgmtModule],
})
export class EmployeeAdminModule {}
