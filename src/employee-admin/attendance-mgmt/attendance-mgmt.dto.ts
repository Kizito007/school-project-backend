import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ArrivalStatus, Departments } from 'src/common/enums';

export class AddAttendanceDto {
  @IsEnum(ArrivalStatus)
  arrivalStatus?: ArrivalStatus;

  @IsOptional()
  @IsString()
  checkIn?: string;

  @IsOptional()
  @IsString()
  checkOut?: string;

  @IsOptional()
  @IsString()
  scheduleIn?: string;

  @IsOptional()
  @IsString()
  scheduleOut?: string;

  @IsOptional()
  @IsString()
  employeeId?: string;

  @IsEnum(Departments)
  @IsOptional()
  department?: Departments;
}
