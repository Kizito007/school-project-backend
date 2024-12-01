import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  Param,
  Query,
  Patch,
} from '@nestjs/common';
import { ResponseMessage } from 'src/common/decorators';
import { JwtAuthGuard } from 'src/commerce-admin/auth/jwt-auth.guard';
import {
  AddAttendanceDto,
  FilterAttendanceStatsQuery,
} from './attendance-mgmt.dto';
import { AttendanceMgmtService } from './attendance-mgmt.service';

@Controller('attendance/attendance-mgmt')
export class AttendanceMgmtController {
  constructor(private readonly attendanceMgmtService: AttendanceMgmtService) {}

  @Get('attendance/:attendanceId')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Attendance fetched successfully')
  async getAttendance(@Param('attendanceId') attendanceId: string) {
    return await this.attendanceMgmtService.findAttendance(
      'attendanceId',
      attendanceId,
    );
  }

  @Post('attendance')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Attendance added successfully')
  async addAttendance(@Body() addAttendanceDto: AddAttendanceDto) {
    return await this.attendanceMgmtService.addAttendance(addAttendanceDto);
  }

  @Get('all-attendance')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Attendance fetched successfully')
  async getAllAttendance(
    @Query() filterAttendanceDto: FilterAttendanceStatsQuery,
  ) {
    return await this.attendanceMgmtService.getAttendance(filterAttendanceDto);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Attendance statistics fetched successfully')
  async getAttendanceStats(
    @Query() filterAttendanceStatsDto: FilterAttendanceStatsQuery,
  ) {
    return await this.attendanceMgmtService.getAttendanceStatsByStatus(
      filterAttendanceStatsDto,
    );
  }

  @Patch('sign-out')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Signed out successfully')
  async signOutAttendance(@Body() addAttendanceDto: AddAttendanceDto) {
    return await this.attendanceMgmtService.signOutAttendance(addAttendanceDto);
  }
}
