import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminMgmtController } from './admin-mgmt.controller';
import { AdminMgmtService } from './admin-mgmt.service';
import { CommerceAdmin, CommerceAdminSchema } from './admin.schema';
import { CloudinaryModule } from 'src/config/cloudinary.module';
import { FilesService } from 'src/files/files.service';
import {
  FaceCompareToken,
  FaceCompareTokenSchema,
} from 'src/faces/face-compare.schema';
import { FacesService } from 'src/faces/faces.service';
import { User, UserSchema } from 'src/commerce-admin/users/users.schema';
import {
  Product,
  ProductSchema,
} from 'src/commerce-admin/products/products.schema';
import { Order, OrderSchema } from 'src/commerce-admin/orders/orders.schema';

@Module({
  imports: [
    CloudinaryModule,
    HttpModule,
    MongooseModule.forFeature([
      { name: CommerceAdmin.name, schema: CommerceAdminSchema },
      { name: FaceCompareToken.name, schema: FaceCompareTokenSchema },
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
  ],
  controllers: [AdminMgmtController],
  providers: [AdminMgmtService, FilesService, FacesService],
})
export class AdminMgmtModule {}
