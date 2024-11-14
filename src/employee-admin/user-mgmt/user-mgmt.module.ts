import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserMgmtController } from './user-mgmt.controller';
import { UserMgmtService } from './user-mgmt.service';
import { EmployeeUser, EmployeeUserSchema } from './user-mgmt.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmployeeUser.name, schema: EmployeeUserSchema },
    ]),
  ],
  controllers: [UserMgmtController],
  providers: [UserMgmtService],
})
export class UserMgmtModule {}
