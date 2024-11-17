import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { FacesController } from './faces.controller';
import { FacesService } from './faces.service';
import {
  FaceCompareToken,
  FaceCompareTokenSchema,
} from './face-compare.schema';
import { FilesService } from 'src/files/files.service';
import { CloudinaryModule } from 'src/config/cloudinary.module';

@Module({
  imports: [
    HttpModule,
    CloudinaryModule,
    MongooseModule.forFeature([
      { name: FaceCompareToken.name, schema: FaceCompareTokenSchema },
    ]),
  ],
  controllers: [FacesController],
  providers: [FacesService, FilesService],
})
export class FacesModule {}
