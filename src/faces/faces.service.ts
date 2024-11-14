import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class FacesService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
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
}
