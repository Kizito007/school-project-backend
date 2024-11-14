import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { KeyGen } from 'src/common/utils/key-gen';

@Schema({ timestamps: true })
export class EmployeeUser {
  @Prop({ unique: true, default: () => `US${KeyGen.gen(13)}` })
  userId: string;

  @Prop({ default: null })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;
}
export type EmployeeUserDocument = EmployeeUser & Document;
export const EmployeeUserSchema = SchemaFactory.createForClass(EmployeeUser);
