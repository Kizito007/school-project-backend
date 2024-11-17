import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { KeyGen } from 'src/common/utils/key-gen';

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true, default: () => `US${KeyGen.gen(13)}` })
  userId: string;

  @Prop({ default: null })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop({ default: false })
  emailVerified: boolean;

  @Prop({ required: true, select: false })
  password: string;
}
export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
