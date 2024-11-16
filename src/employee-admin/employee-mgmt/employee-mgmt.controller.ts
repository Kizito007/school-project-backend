import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ResponseMessage } from 'src/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { FacesService } from 'src/faces/faces.service';
import { UploadTempFaceDto } from 'src/commerce-admin/admin/admin-mgmt/admin-mgmt.dto';
import { EmployeeMgmtService } from './employee-mgmt.service';
import { JwtAuthGuard } from 'src/commerce-admin/auth/jwt-auth.guard';
import { AddEmployeeDto } from './employee-mgmt.dto';
import { Departments } from 'src/common/enums';

@Controller('employee/employee-mgmt')
export class EmployeeMgmtController {
  constructor(
    private readonly employeeMgmtService: EmployeeMgmtService,
    private readonly facesService: FacesService,
  ) {}

  @Get('employees/:employeeId')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Employee fetched successfully')
  async getEmployee(@Param('employeeId') employeeId: string) {
    return await this.employeeMgmtService.findEmployee(
      'employeeId',
      employeeId,
    );
  }

  @Get('employees')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Employees fetched successfully')
  async getEmployees() {
    return await this.employeeMgmtService.getEmployees();
  }

  @Get('departments')
  @ResponseMessage('Departments fetched successfully')
  async getDepartments() {
    const departments = Object.values(Departments);
    return departments;
  }

  @Post('employees')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Employee added successfully')
  @UseInterceptors(FileInterceptor('file'))
  async addEmployee(
    @Body() addEmployeeDto: AddEmployeeDto,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return await this.employeeMgmtService.addEmployee(addEmployeeDto, file);
  }

  @Post('upload-face/:employeeId')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ResponseMessage('Photo uploaded successfully')
  async uploadFace(
    @Body() uploadTempFaceDto: UploadTempFaceDto,
    @Param('employeeId') employeeId: string,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    uploadTempFaceDto.adminId = employeeId;
    return await this.facesService.uploadTempFace(uploadTempFaceDto, file);
  }

  @Post('compare-face/:employeeId')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Face comparison successful')
  async compareFace(@Param('employeeId') employeeId: string) {
    return await this.employeeMgmtService.compareFace(employeeId);
  }
}
