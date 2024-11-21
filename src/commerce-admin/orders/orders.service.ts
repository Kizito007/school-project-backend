import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './orders.schema';
import { CreateOrderDto } from './orders.dto';
import { OrderNotFoundException } from 'src/common/exceptions';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
  ) {}

  async findOrder(
    field: string,
    key: string,
  ): Promise<Order | null | undefined> {
    try {
      const order = await this.orderModel.findOne(
        { [field]: key },
        { _id: 0 },
        { lean: true },
      );
      if (!order) throw OrderNotFoundException();

      return order;
    } catch (error) {
      throw error;
    }
  }

  async findOrders() {
    try {
      const orders = await this.orderModel.find({});
      const totalOrdersCount = await this.orderModel.countDocuments();

      return { orders, totalOrdersCount };
    } catch (error) {
      throw error;
    }
  }

  async createOrder({
    ...createOrderDto
  }: CreateOrderDto): Promise<OrderDocument> {
    try {
      const newOrder = await this.orderModel.create(createOrderDto);
      if (!newOrder?.orderId) {
        throw new InternalServerErrorException('Unable to add order');
      }
      return newOrder;
    } catch (error) {
      throw error;
    }
  }
}
