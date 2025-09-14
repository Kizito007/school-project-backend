import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { File } from 'src/common/dtos';
import { Departments } from 'src/common/enums';
import { KeyGen } from 'src/common/utils/key-gen';

@Schema({ timestamps: true })
export class Employee {
  @Prop({ unique: true, default: () => `EM${KeyGen.gen(13)}` })
  employeeId: string;

  @Prop({ default: null })
  firstname: string;

  @Prop({ default: null })
  lastname: string;

  @Prop({ default: null })
  email: string;

  @Prop({ default: null })
  phone: string;

  @Prop({ default: null })
  address: string;

  @Prop({ default: null })
  role: string;

  @Prop({ default: null, enum: Departments })
  department: Departments;

  @Prop({ default: null })
  photo: File;

  @Prop({ default: null })
  scheduleIn: string;

  @Prop({ default: 0 })
  salary: number;

  @Prop({ default: 0 })
  additions: number;

  @Prop({ default: 0 })
  deductions: number;
}
export type EmployeeDocument = Employee & Document;
export const EmployeeSchema = SchemaFactory.createForClass(Employee);
