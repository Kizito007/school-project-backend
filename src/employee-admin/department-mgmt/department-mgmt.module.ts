import { Module } from '@nestjs/common';
import { DepartmentMgmtController } from './department-mgmt.controller';
import { DepartmentMgmtService } from './department-mgmt.service';

@Module({
  controllers: [DepartmentMgmtController],
  providers: [DepartmentMgmtService]
})
export class DepartmentMgmtModule {}
