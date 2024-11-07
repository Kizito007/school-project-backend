import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AdminMgmtModule } from './admin-mgmt/admin-mgmt.module';

@Module({
  imports: [AuthModule, AdminMgmtModule]
})
export class AdminModule {}
