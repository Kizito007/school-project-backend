import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderMgmtController } from './order-mgmt.controller';
import { OrderMgmtService } from './order-mgmt.service';
import { Order, OrderSchema } from 'src/commerce-admin/orders/orders.schema';
import { OrdersService } from 'src/commerce-admin/orders/orders.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
  ],
  controllers: [OrderMgmtController],
  providers: [OrderMgmtService, OrdersService],
})
export class OrderMgmtModule {}
