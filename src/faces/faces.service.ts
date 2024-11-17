import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { UploadTempFaceDto } from 'src/commerce-admin/admin/admin-mgmt/admin-mgmt.dto';
import { FilesService } from 'src/files/files.service';
import {
  FaceCompareToken,
  FaceCompareTokenDocument,
} from './face-compare.schema';
import { FaceTokenExistsException } from 'src/common/exceptions';

@Injectable()
export class FacesService {
  constructor(
    @InjectModel(FaceCompareToken.name)
    private readonly faceCompareTokenModel: Model<FaceCompareTokenDocument>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly filesService: FilesService,
  ) {}

  async compareFace(imgUrl1: string, imgUrl2: string) {
    const apiKey = this.configService.get('FACE_PLUS_API_KEY');
    const apiSecret = this.configService.get('FACE_PLUS_SECRET_KEY');

    const url = `
    https://api-us.faceplusplus.com/facepp/v3/compare?api_key=${apiKey}&api_secret=${apiSecret}&image_url1=${imgUrl1}&image_url2=${imgUrl2}
    `;

    try {
      const response: AxiosResponse<any> = await lastValueFrom(
        this.httpService.post(url),
      );
      // Access response data
      return response.data;
    } catch (error) {
      // Handle errors, log or throw if necessary
      throw new Error('Failed to fetch data from external API');
    }
  }

  async uploadTempFace(
    uploadTempFaceDto: UploadTempFaceDto,
    file: Express.Multer.File,
  ) {
    if (file) {
      const upload = await this.filesService.uploadFile(file);

      uploadTempFaceDto.photo = {
        content: upload.public_id,
        size: upload.bytes,
        mimeType: file.mimetype,
        url: upload.url,
      };
    }
    const faceCompareToken = await this.faceCompareTokenModel.findOne({
      adminId: uploadTempFaceDto.adminId,
    });
    if (faceCompareToken) {
      throw FaceTokenExistsException();
    }
    return await this.faceCompareTokenModel.create(uploadTempFaceDto);
  }
}
