import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { CloudinaryModule } from 'src/config/cloudinary.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, CloudinaryModule],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
