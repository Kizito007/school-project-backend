import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { KeyGen } from 'src/common/utils/key-gen';
import { AdminRole, SecurityQuestion } from './admin.enum';
import { File } from 'src/common/dtos';

export type CommerceAdminDocument = CommerceAdmin & Document;
@Schema({ timestamps: true })
export class CommerceAdmin {
  @Prop({ unique: true, default: () => `AD${KeyGen.gen(13)}` })
  adminId: string;

  @Prop({ unique: true, required: true, sparse: true })
  username: string;

  @Prop({ sparse: true, select: false, unique: true })
  _username: string;

  @Prop({ unique: true, required: true, sparse: true })
  email: string;

  @Prop({ default: null, select: false })
  password: string;

  @Prop({ boolean: true, default: false })
  emailVerified: boolean;

  @Prop({ required: true, enum: AdminRole, default: AdminRole.ARBITRATOR })
  role: AdminRole;

  @Prop({ required: true })
  addedById: string;

  @Prop({ required: true, enum: SecurityQuestion })
  securityQuestion: SecurityQuestion;

  @Prop({ default: null })
  securityAnswer: string;

  @Prop({ default: null })
  photo: File;
}
export const CommerceAdminSchema = SchemaFactory.createForClass(CommerceAdmin);
