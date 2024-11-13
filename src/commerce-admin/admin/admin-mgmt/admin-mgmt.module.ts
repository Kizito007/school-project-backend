import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminMgmtController } from './admin-mgmt.controller';
import { AdminMgmtService } from './admin-mgmt.service';
import { CommerceAdmin, CommerceAdminSchema } from './admin.schema';
import { CloudinaryModule } from 'src/config/cloudinary.module';
import { FilesService } from 'src/files/files.service';

@Module({
  imports: [
    CloudinaryModule,
    MongooseModule.forFeature([
      { name: CommerceAdmin.name, schema: CommerceAdminSchema },
    ]),
  ],
  controllers: [AdminMgmtController],
  providers: [AdminMgmtService, FilesService],
})
export class AdminMgmtModule {}
