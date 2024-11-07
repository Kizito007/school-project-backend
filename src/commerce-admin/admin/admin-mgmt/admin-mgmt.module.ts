import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminMgmtController } from './admin-mgmt.controller';
import { AdminMgmtService } from './admin-mgmt.service';
import { CommerceAdmin, CommerceAdminSchema } from './admin.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CommerceAdmin.name, schema: CommerceAdminSchema },
    ]),
  ],
  controllers: [AdminMgmtController],
  providers: [AdminMgmtService],
})
export class AdminMgmtModule {}
