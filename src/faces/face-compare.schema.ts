import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, Document } from 'mongoose';
import { File } from 'src/common/dtos';

export type FaceCompareTokenDocument = FaceCompareToken & Document;

@Schema({ timestamps: true })
export class FaceCompareToken {
  @Prop({ required: true, unique: true })
  adminId: string;

  @Prop({ default: null })
  photo: File;

  @Prop({
    type: Date,
    default: Date.now,
    expires: 3600,
  })
  createdAt: Date;
}

const FaceCompareTokenSchema = SchemaFactory.createForClass(FaceCompareToken);
export { FaceCompareTokenSchema };
