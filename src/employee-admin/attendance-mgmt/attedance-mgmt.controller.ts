import { Controller, Get, Post, UseGuards, Body, Param } from '@nestjs/common';
import { ResponseMessage } from 'src/common/decorators';
import { JwtAuthGuard } from 'src/commerce-admin/auth/jwt-auth.guard';
import { AddAttendanceDto } from './attendance-mgmt.dto';
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
  async getAllAttendance() {
    return await this.attendanceMgmtService.getAttendance();
  }
}
