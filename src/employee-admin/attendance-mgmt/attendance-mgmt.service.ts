import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Attendance, AttendanceDocument } from './attendance-mgmt.schema';
import { AddAttendanceDto } from './attendance-mgmt.dto';
import { ArrivalStatus, departmentsSchedule } from 'src/common/enums';

@Injectable()
export class AttendanceMgmtService {
  constructor(
    @InjectModel(Attendance.name)
    private readonly attendanceModel: Model<AttendanceDocument>,
  ) {}

  async findAttendance(
    field: string,
    key: string,
  ): Promise<Attendance | null | undefined> {
    try {
      const attendance = await this.attendanceModel.findOne(
        { [field]: key },
        { _id: 0 },
        { lean: true },
      );

      return attendance;
    } catch (error) {
      throw error;
    }
  }

  async getAttendance(): Promise<Attendance[] | null | undefined> {
    try {
      const attendance = await this.attendanceModel.find({});

      return attendance;
    } catch (error) {
      throw error;
    }
  }

  async addAttendance(
    addAttendanceDto: AddAttendanceDto,
  ): Promise<AttendanceDocument> {
    try {
      const { department } = addAttendanceDto;

      // Validate department exists in the schedule
      const departmentSchedule = departmentsSchedule[department.toUpperCase()];
      if (!departmentSchedule) {
        throw new BadRequestException(
          `Department '${department}' does not exist in the schedule.`,
        );
      }

      if (!addAttendanceDto.checkIn) {
        const now = new Date();
        const hours = now.getHours(); // Returns the hour (0-23)
        const minutes = now.getMinutes().toString().padStart(2, '0'); // Returns the minute (0-59)

        const checkInTime = `${hours}:${minutes}`;
        addAttendanceDto.checkIn = checkInTime;
      }

      const { scheduleIn, scheduleOut } = departmentSchedule;
      addAttendanceDto.scheduleIn = scheduleIn;
      addAttendanceDto.scheduleOut = scheduleOut;

      const arrivalStatus = this.compareTimes(
        addAttendanceDto.checkIn,
        scheduleIn,
      );
      addAttendanceDto.arrivalStatus = arrivalStatus;

      const newAttendance = await this.attendanceModel.create(addAttendanceDto);
      return newAttendance;
    } catch (error) {
      throw error;
    }
  }

  async updateField(
    key: string,
    value: string,
    field: string,
    value2: string | boolean | object,
  ): Promise<Attendance | null | undefined> {
    try {
      return await this.attendanceModel.findOneAndUpdate(
        { [key]: value },
        { $set: { [field]: value2 } },
        { lean: true, new: true },
      );
    } catch (error) {
      throw error;
    }
  }

  private compareTimes(time1: string, time2: string): ArrivalStatus {
    const [hours1, minutes1] = time1.split(':').map(Number);
    const [hours2, minutes2] = time2.split(':').map(Number);

    const totalMinutes1 = hours1 * 60 + minutes1;
    const totalMinutes2 = hours2 * 60 + minutes2;

    let arrivalStatus: ArrivalStatus;
    if (totalMinutes1 < totalMinutes2) {
      arrivalStatus = ArrivalStatus.EARLY;
    } else if (totalMinutes1 == totalMinutes2) {
      arrivalStatus = ArrivalStatus.ONTIME;
    } else {
      arrivalStatus = ArrivalStatus.LATE;
    }

    return arrivalStatus;
  }
}
