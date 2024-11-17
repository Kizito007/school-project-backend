import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import * as pluralize from 'pluralize';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { mimeTypes } from './constants';
import { StringConverter } from './utils/string-converter';

export const fileInterceptor = FileInterceptor('file', {
  limits: {
    fileSize: 1024 * 1024 * 20, //20MB
  },
  fileFilter: (req, file, callback) => {
    if (!mimeTypes.includes(file.mimetype)) {
      return callback(new ForbiddenException('invalid mime type'), false);
    }
    callback(null, true);
  },
});

export const filesInterceptor = FilesInterceptor('files', 5, {
  limits: {
    fileSize: 1024 * 1024 * 20, //20MB
  },
  fileFilter: (req, file, callback) => {
    if (file.size < 1) {
      return callback(new BadRequestException('empty file'), false);
    }
    if (!mimeTypes.includes(file.mimetype)) {
      return callback(new ForbiddenException('invalid mime type'), false);
    }
    callback(null, true);
  },
});

export interface Response<T> {
  status: boolean;
  statusCode: number;
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const responseMessage = this.reflector.get<string>(
      'responseMessage',
      context.getHandler(),
    );
    const rawResponse = this.reflector.get<boolean>(
      'rawResponse',
      context.getHandler(),
    );

    const request: Request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const root = request.url.split('/')[3];
    let keyword: 'fetched' | 'added' | 'deleted';
    switch (request.method) {
      case 'GET':
        keyword = 'fetched';
        break;
      case 'POST':
      case 'PUT':
        keyword = 'added';
        break;
      case 'DELETE':
        keyword = 'deleted';
        break;
      default:
        keyword = null;
    }
    let status: boolean;
    if (response.statusCode == 200 || response.statusCode == 201) {
      status = true;
    } else {
      status = false;
    }
    if (rawResponse) {
      return next.handle().pipe(map((data) => ({ ...data })));
    }
    return next.handle().pipe(
      map((data) => ({
        status,
        statusCode: context.switchToHttp().getResponse().statusCode,
        message:
          StringConverter.toSentenceCase(responseMessage || '') ||
          `${StringConverter.toTitleCase(pluralize.singular(root || ''))} record(s) ${keyword} successfully`,
        data: data || null,
      })),
    );
  }
}
