import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ArrivalStatus, Departments } from 'src/common/enums';
import { KeyGen } from 'src/common/utils/key-gen';

@Schema({ timestamps: true })
export class Attendance {
  @Prop({ unique: true, default: () => `AT${KeyGen.gen(13)}` })
  attendanceId: string;

  @Prop({ default: null })
  employeeId: string;

  @Prop({ default: null, enum: ArrivalStatus })
  arrivalStatus: ArrivalStatus;

  @Prop({ default: null, enum: Departments })
  department: Departments;

  @Prop({ default: null })
  checkIn: string;

  @Prop({ default: null })
  checkOut: string;

  @Prop({ default: null })
  scheduleIn: string;

  @Prop({ default: null })
  scheduleOut: string;

  @Prop({ default: false })
  hasEarlyDeparture: boolean;
}
export type AttendanceDocument = Attendance & Document;
export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
