import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Attendance, AttendanceDocument } from './attendance-mgmt.schema';
import {
  AddAttendanceDto,
  FilterAttendanceStatsQuery,
} from './attendance-mgmt.dto';
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

  async getAttendance({
    name,
    startDate,
    endDate,
    department,
    employeeId,
  }: FilterAttendanceStatsQuery): Promise<Attendance[] | null | undefined> {
    try {
      const filter: any = {
        createdAt: {
          $gte: startDate ? new Date(startDate) : Date.now(),
          ...(endDate ? { $lte: new Date(endDate) } : {}),
        },
      };

      // Add additional filters if provided
      if (department) {
        filter['department'] = { $regex: department, $options: 'i' };
      }
      if (employeeId) {
        filter['employeeId'] = { $regex: employeeId, $options: 'i' };
      }

      // Query the attendance data
      const attendance = await this.attendanceModel
        .find(filter, {}, { lean: true })
        .sort({ createdAt: -1 }) // Sort by createdAt in descending order
        .populate({
          path: 'employee',
          select: {
            firstname: 1,
            lastname: 1,
            photo: 1,
            additions: 1,
            deductions: 1,
            role: 1,
            salary: 1,
            _id: 0,
            employeeId: 0,
          },
          match: name
            ? {
                $or: [
                  { firstname: { $regex: name, $options: 'i' } },
                  { lastname: { $regex: name, $options: 'i' } },
                ],
              }
            : undefined,
        });

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
        const hours = now.getUTCHours() + 1; // Returns the hour (0-23)
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

  async signOutAttendance(
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

      if (!addAttendanceDto.checkOut) {
        const now = new Date();
        const hours = now.getUTCHours() + 1; // Returns the hour (0-23)
        const minutes = now.getMinutes().toString().padStart(2, '0'); // Returns the minute (0-59)

        const checkOutTime = `${hours}:${minutes}`;
        addAttendanceDto.checkOut = checkOutTime;
      }

      const { scheduleOut } = departmentSchedule;
      addAttendanceDto.scheduleIn = scheduleOut;
      addAttendanceDto.scheduleOut = scheduleOut;

      const earlyDeparture = this.compareDepartureTimes(
        addAttendanceDto.checkOut,
        scheduleOut,
      );

      return await this.attendanceModel.findOneAndUpdate(
        {
          attendanceId: addAttendanceDto.attendanceId,
        },
        {
          hasEarlyDeparture: earlyDeparture,
          checkOut: addAttendanceDto.checkOut,
        },
        { new: true },
      );
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

  private compareDepartureTimes(time1: string, time2: string): boolean {
    const [hours1, minutes1] = time1.split(':').map(Number);
    const [hours2, minutes2] = time2.split(':').map(Number);

    const totalMinutes1 = hours1 * 60 + minutes1;
    const totalMinutes2 = hours2 * 60 + minutes2;

    if (totalMinutes1 < totalMinutes2) {
      return true;
    }
    return false;
  }

  async getAttendanceStatsByStatus({
    startDate,
    endDate,
    employeeId,
    department,
  }: FilterAttendanceStatsQuery): Promise<any> {
    const matchStage: any = {
      createdAt: {
        $gte: startDate ? new Date(startDate) : {},
        ...(endDate ? { $lte: new Date(endDate) } : {}),
      },
    };

    // Add additional filters if provided
    if (department) {
      matchStage['department'] = { $regex: department, $options: 'i' };
    }
    if (employeeId) {
      matchStage['employeeId'] = { $regex: employeeId, $options: 'i' };
    }

    const stats = await this.attendanceModel.aggregate([
      { $match: matchStage },
      {
        $facet: {
          totalCount: [{ $count: 'count' }],
          arrivalStats: [
            {
              $group: {
                _id: '$arrivalStatus',
                count: { $sum: 1 },
              },
            },
          ],
          earlyDepartures: [
            { $match: { hasEarlyDeparture: true } },
            { $count: 'count' },
          ],
        },
      },
      {
        $project: {
          totalCount: { $arrayElemAt: ['$totalCount.count', 0] },
          arrivalStats: 1,
          earlyDepartures: { $arrayElemAt: ['$earlyDepartures.count', 0] },
        },
      },
    ]);

    const { totalCount, arrivalStats, earlyDepartures } = stats[0];

    // Transform arrivalStats into the desired object format
    const status = arrivalStats.reduce((acc, { _id, count }) => {
      acc[_id] = count;
      return acc;
    }, {});

    return {
      totalCount: totalCount || 0,
      status,
      earlyDepartures: earlyDepartures || 0,
    };
  }
}
