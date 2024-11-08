import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CreateOrderDto } from './orders.dto';
import { ResponseMessage } from 'src/common/decorators';
import { OrdersService } from './orders.service';
import { AuthUser } from '../auth/auth-user.decorator';
import { CommerceUser } from '../users/users.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('commerce/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('order/:orderId')
  @ResponseMessage('Order fetched successfully')
  async getOrder(@Param('orderId') orderId: string) {
    return await this.ordersService.findOrder('orderId', orderId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Order created successfully')
  async createOrder(
    @AuthUser() user: CommerceUser,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    createOrderDto.userId = user.userId;
    return await this.ordersService.createOrder(createOrderDto);
  }
}
