import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductMgmtController } from './product-mgmt.controller';
import { ProductMgmtService } from './product-mgmt.service';
import { ProductsService } from 'src/commerce-admin/products/products.service';
import {
  Product,
  ProductSchema,
} from 'src/commerce-admin/products/products.schema';
import { CloudinaryModule } from 'src/config/cloudinary.module';
import { FilesService } from 'src/files/files.service';

@Module({
  imports: [
    CloudinaryModule,
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [ProductMgmtController],
  providers: [ProductMgmtService, ProductsService, FilesService],
})
export class ProductMgmtModule {}
