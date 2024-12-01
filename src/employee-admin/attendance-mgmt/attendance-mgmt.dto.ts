import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { ArrivalStatus, Departments } from 'src/common/enums';

export class AddAttendanceDto {
  @IsOptional()
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

  @IsOptional()
  attendanceId?: string;

  @IsOptional()
  @IsBoolean()
  hasEarlyDeparture?: boolean;
}

export class FilterAttendanceStatsQuery {
  @IsString()
  @IsOptional()
  startDate?: string;

  @IsString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  name?: string;
}
