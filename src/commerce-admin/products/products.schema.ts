import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { File } from 'src/common/dtos';
import { KeyGen } from 'src/common/utils/key-gen';

@Schema({ timestamps: true })
export class Product {
  @Prop({ unique: true, default: () => `PD${KeyGen.gen(13)}` })
  productId: string;

  @Prop({ required: true, text: true })
  name: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: null })
  description: string;

  @Prop({ default: null })
  status: string;

  @Prop({ default: 0 })
  percentageDiscount: number;

  @Prop({ default: 1 })
  minimumOrder: number;

  @Prop({ required: true })
  availableStock: number;

  @Prop({ default: 0 })
  totalStock: number;

  @Prop({ default: null })
  photo: File;
}
export type ProductDocument = Product & Document;
export const ProductSchema = SchemaFactory.createForClass(Product);
