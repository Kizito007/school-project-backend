import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FacesController } from './faces.controller';
import { FacesService } from './faces.service';

@Module({
  imports: [HttpModule],
  controllers: [FacesController],
  providers: [FacesService],
})
export class FacesModule {}
