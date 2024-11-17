import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminMgmtController } from './admin-mgmt.controller';
import { AdminMgmtService } from './admin-mgmt.service';
import { CommerceAdmin, CommerceAdminSchema } from './admin.schema';
import { CloudinaryModule } from 'src/config/cloudinary.module';
import { FilesService } from 'src/files/files.service';
import {
  FaceCompareToken,
  FaceCompareTokenSchema,
} from 'src/faces/face-compare.schema';
import { FacesService } from 'src/faces/faces.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    CloudinaryModule,
    HttpModule,
    MongooseModule.forFeature([
      { name: CommerceAdmin.name, schema: CommerceAdminSchema },
      { name: FaceCompareToken.name, schema: FaceCompareTokenSchema },
    ]),
  ],
  controllers: [AdminMgmtController],
  providers: [AdminMgmtService, FilesService, FacesService],
})
export class AdminMgmtModule {}
