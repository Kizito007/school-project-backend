import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, Document } from 'mongoose';

export type VerifyEmailDocument = VerifyEmail & Document;

@Schema({ timestamps: true })
export class VerifyEmail {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  token: string;

  @Prop({
    type: Date,
    default: Date.now,
  })
  createdAt: Date;
}

const VerifyEmailSchema = SchemaFactory.createForClass(VerifyEmail);
VerifyEmailSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 5 });

export { VerifyEmailSchema };
