import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { KeyGen } from 'src/common/utils/key-gen';

@Schema({ timestamps: true })
export class CommerceUser {
  @Prop({ unique: true, default: () => `US${KeyGen.gen(13)}` })
  userId: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop({ default: false })
  emailVerified: boolean;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ default: null })
  securityAnswer: string;
}
export type CommerceUserDocument = CommerceUser & Document;
export const CommmerceUserSchema = SchemaFactory.createForClass(CommerceUser);
