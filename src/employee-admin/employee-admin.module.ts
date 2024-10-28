import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DepartmentMgmtModule } from './department-mgmt/department-mgmt.module';
import { UserMgmtModule } from './user-mgmt/user-mgmt.module';

@Module({
  imports: [AuthModule, DepartmentMgmtModule, UserMgmtModule]
})
export class EmployeeAdminModule {}
