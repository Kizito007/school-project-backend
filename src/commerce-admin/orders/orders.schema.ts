import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { KeyGen } from 'src/common/utils/key-gen';

@Schema({ timestamps: true })
export class Order {
  @Prop({ unique: true, default: () => `OR${KeyGen.gen(13)}` })
  orderId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: null })
  qty: string;

  @Prop({ default: null })
  status: string;

  @Prop({ default: null })
  productId: string;

  @Prop({ default: null })
  userId: string;
}
export type OrderDocument = Order & Document;
export const OrderSchema = SchemaFactory.createForClass(Order);
