import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtPartialAuthGuard } from '../auth/admin-jwt-partial-auth.guard';
import { RolesGuard } from '../auth/role.guard';
import { ResponseMessage } from 'src/common/decorators';
import { OrdersService } from 'src/commerce-admin/orders/orders.service';

@Controller('commerce/admin/order-mgmt')
export class OrderMgmtController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('orders')
  @UseGuards(JwtPartialAuthGuard, RolesGuard)
  @ResponseMessage('Orders fetched successfully')
  async getOrders() {
    return await this.ordersService.findOrders();
  }

  @Get('orders/:orderId')
  @UseGuards(JwtPartialAuthGuard, RolesGuard)
  @ResponseMessage('Order fetched successfully')
  async getProduct(@Param('orderId') orderId: string) {
    return await this.ordersService.findOrder('orderId', orderId);
  }
}
