import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employee, EmployeeDocument } from './employee-mgmt.schema';
import { AddEmployeeDto } from './employee-mgmt.dto';
import { FilesService } from 'src/files/files.service';
import {
  FaceCompareToken,
  FaceCompareTokenDocument,
} from 'src/faces/face-compare.schema';
import {
  Attendance,
  AttendanceDocument,
} from '../attendance-mgmt/attendance-mgmt.schema';
import { FacesService } from 'src/faces/faces.service';
import { AttendanceMgmtService } from '../attendance-mgmt/attendance-mgmt.service';
import { FaceTokenInexistingException } from 'src/common/exceptions';
import { AddAttendanceDto } from '../attendance-mgmt/attendance-mgmt.dto';

@Injectable()
export class EmployeeMgmtService {
  constructor(
    @InjectModel(Employee.name)
    private readonly employeeModel: Model<EmployeeDocument>,
    @InjectModel(Attendance.name)
    private readonly attendanceModel: Model<AttendanceDocument>,
    @InjectModel(FaceCompareToken.name)
    private readonly faceCompareTokenModel: Model<FaceCompareTokenDocument>,
    private readonly filesService: FilesService,
    private readonly facesService: FacesService,
    private readonly attendanceMgmtService: AttendanceMgmtService,
  ) {}

  async findEmployee(
    field: string,
    key: string,
  ): Promise<Employee | null | undefined> {
    try {
      const employee = await this.employeeModel.findOne(
        { [field]: key },
        { _id: 0 },
        { lean: true },
      );

      return employee;
    } catch (error) {
      throw error;
    }
  }

  async getEmployees(): Promise<Employee[] | null | undefined> {
    try {
      const employees = await this.employeeModel.find({});

      return employees;
    } catch (error) {
      throw error;
    }
  }

  async addEmployee(
    addEmployeeDto: AddEmployeeDto,
    file: Express.Multer.File,
  ): Promise<EmployeeDocument> {
    try {
      if (file) {
        const upload = await this.filesService.uploadFile(file);

        addEmployeeDto.photo = {
          content: upload.public_id,
          size: upload.bytes,
          mimeType: file.mimetype,
          url: upload.url,
        };
      }
      const newEmployee = await this.employeeModel.create(addEmployeeDto);
      return newEmployee;
    } catch (error) {
      throw error;
    }
  }

  async updateField(
    key: string,
    value: string,
    field: string,
    value2: string | boolean | object,
  ): Promise<Employee | null | undefined> {
    try {
      return await this.employeeModel.findOneAndUpdate(
        { [key]: value },
        { $set: { [field]: value2 } },
        { lean: true, new: true },
      );
    } catch (error) {
      throw error;
    }
  }

  async compareFace(employeeId: string) {
    const faceCompareToken = await this.faceCompareTokenModel.findOne({
      adminId: employeeId,
    });
    if (!faceCompareToken) throw FaceTokenInexistingException();
    const employee = await this.employeeModel.findOne({ employeeId });
    const imageUrl1 = faceCompareToken.photo?.url;
    const imageUrl2 = employee.photo?.url;
    const comparison = await this.facesService.compareFace(
      imageUrl1,
      imageUrl2,
    );
    // if comparison data confidence is high > 85 add attendance
    if (comparison && comparison.confidence > 85) {
      const addAttendanceDto: AddAttendanceDto = {
        employeeId: employee.employeeId,
        department: employee.department,
      };

      await this.attendanceMgmtService.addAttendance(addAttendanceDto);
    }

    await this.filesService.deleteImage(faceCompareToken.photo?.content);
    await this.faceCompareTokenModel.findOneAndDelete({ adminId: employeeId });
    return comparison;
  }
}
