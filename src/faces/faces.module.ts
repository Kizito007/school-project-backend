import { Module } from '@nestjs/common';
import { FacesController } from './faces.controller';
import { FacesService } from './faces.service';

@Module({
  controllers: [FacesController],
  providers: [FacesService]
})
export class FacesModule {}
