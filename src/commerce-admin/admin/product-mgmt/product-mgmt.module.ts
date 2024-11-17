import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductMgmtController } from './product-mgmt.controller';
import { ProductMgmtService } from './product-mgmt.service';
import { ProductsService } from 'src/commerce-admin/products/products.service';
import {
  Product,
  ProductSchema,
} from 'src/commerce-admin/products/products.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [ProductMgmtController],
  providers: [ProductMgmtService, ProductsService],
})
export class ProductMgmtModule {}
