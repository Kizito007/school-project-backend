import { Module } from '@nestjs/common';
import { UserMgmtController } from './user-mgmt.controller';
import { UserMgmtService } from './user-mgmt.service';

@Module({
  controllers: [UserMgmtController],
  providers: [UserMgmtService]
})
export class UserMgmtModule {}
