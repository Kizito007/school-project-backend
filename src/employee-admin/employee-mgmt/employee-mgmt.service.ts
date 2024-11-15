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
import { FacesService } from 'src/faces/faces.service';
import { FaceTokenInexistingException } from 'src/common/exceptions';

@Injectable()
export class EmployeeMgmtService {
  constructor(
    @InjectModel(Employee.name)
    private readonly employeeModel: Model<EmployeeDocument>,
    @InjectModel(FaceCompareToken.name)
    private readonly faceCompareTokenModel: Model<FaceCompareTokenDocument>,
    private readonly filesService: FilesService,
    private readonly facesService: FacesService,
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

  async addEmployee(
    addEmployeeDto: AddEmployeeDto,
    file: Express.Multer.File,
  ): Promise<EmployeeDocument> {
    try {
      if (file) {
        const upload = await this.filesService.uploadFile(file);

        addEmployeeDto.photo = {
          content: 'profile-picture',
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
    await this.filesService.deleteImage(faceCompareToken.photo?.content);
    await this.faceCompareTokenModel.findOneAndDelete({ adminId: employeeId });
    return comparison;
  }
}
