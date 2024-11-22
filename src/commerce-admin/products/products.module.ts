import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product, ProductSchema } from './products.schema';
import { CloudinaryModule } from 'src/config/cloudinary.module';
import { FilesService } from 'src/files/files.service';

@Module({
  imports: [
    CloudinaryModule,
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, FilesService],
})
export class ProductsModule {}
