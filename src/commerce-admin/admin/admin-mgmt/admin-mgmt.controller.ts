import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  Patch,
  Param,
  UploadedFile,
  UseInterceptors,
  Delete,
} from '@nestjs/common';
import { AuthUser } from 'src/commerce-admin/auth/auth-user.decorator';
import { AdminMgmtService } from './admin-mgmt.service';
import { UserPayload } from 'src/commerce-admin/users/users.dto';
import {
  AddManagerDto,
  SendEmailDto,
  UpdateManagerRoleDto,
  UploadTempFaceDto,
} from './admin-mgmt.dto';
import { TokenHandler } from 'src/common/utils/token-handler';
import {
  EmailAlreadyUsedException,
  UsernameAlreadyExistsException,
} from 'src/common/exceptions';
import { Roles } from '../auth/roles.decorator';
import { AdminRole } from './admin.enum';
import { JwtPartialAuthGuard } from '../auth/admin-jwt-partial-auth.guard';
import { RolesGuard } from '../auth/role.guard';
import { ResponseMessage } from 'src/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { FacesService } from 'src/faces/faces.service';

@Controller('commerce/admin/admin-mgmt')
export class AdminMgmtController {
  constructor(
    private readonly adminMgmtService: AdminMgmtService,
    private readonly facesService: FacesService,
  ) {}

  @Get('admins')
  @UseGuards(JwtPartialAuthGuard, RolesGuard)
  @ResponseMessage('Admins fetched successfully')
  async getAdmins() {
    return await this.adminMgmtService.getAdmins();
  }

  @Get('users')
  @UseGuards(JwtPartialAuthGuard, RolesGuard)
  @ResponseMessage('Users fetched successfully')
  async getUsers() {
    return await this.adminMgmtService.getUsers();
  }

  @Get('admins/stats')
  @UseGuards(JwtPartialAuthGuard, RolesGuard)
  @ResponseMessage('Admin stats fetched successfully')
  async getAdminStats() {
    return await this.adminMgmtService.getAdminStats();
  }

  @Get('admins/:adminId')
  @UseGuards(JwtPartialAuthGuard, RolesGuard)
  @ResponseMessage('Admin fetched successfully')
  async getAdmin(@Param('adminId') adminId: string) {
    return await this.adminMgmtService.getAdmin('adminId', adminId);
  }

  @Post('send-bulk-email')
  @UseGuards(JwtPartialAuthGuard, RolesGuard)
  @ResponseMessage('Emails sent successfully')
  async sendBulkEmail(@Body() sendEmailDto: SendEmailDto) {
    return await this.adminMgmtService.sendBulkEmail(sendEmailDto);
  }

  @Post('admins')
  @UseGuards(JwtPartialAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN)
  @ResponseMessage('Admin added successfully')
  @UseInterceptors(FileInterceptor('file'))
  async addManager(
    @Body() addManagerDto: AddManagerDto,
    @AuthUser() { userId }: UserPayload,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    addManagerDto.addedById = userId;

    let admin = await this.adminMgmtService.getAdmin(
      'email',
      addManagerDto.email,
    );

    //return if email already exists
    if (admin?.email) {
      throw EmailAlreadyUsedException();
    }

    admin = await this.adminMgmtService.getAdmin(
      '_username',
      addManagerDto.username.toLocaleLowerCase(),
    );

    if (admin?.username) {
      throw UsernameAlreadyExistsException();
    }

    // hash password
    const passwordHash = await TokenHandler.hashKey(addManagerDto.password);
    addManagerDto.password = passwordHash;
    addManagerDto._username = addManagerDto.username.toLocaleLowerCase();
    addManagerDto.adminLastSeenTimestamp = new Date();
    return await this.adminMgmtService.addManager(addManagerDto, file);
  }

  @Post('upload-face')
  @UseGuards(JwtPartialAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ResponseMessage('Photo uploaded successfully')
  async uploadFace(
    @Body() uploadTempFaceDto: UploadTempFaceDto,
    @AuthUser() { userId }: UserPayload,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    uploadTempFaceDto.adminId = userId;
    return await this.facesService.uploadTempFace(uploadTempFaceDto, file);
  }

  @Post('compare-face')
  @UseGuards(JwtPartialAuthGuard, RolesGuard)
  @ResponseMessage('Face comparison successful')
  async compareFace(@AuthUser() { userId }: UserPayload) {
    return await this.adminMgmtService.compareFace(userId);
  }

  @Patch('admins/:adminId/role')
  @UseGuards(JwtPartialAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN)
  @ResponseMessage('Admin role updated successfully')
  async updateManagerRole(
    @Body() updateManagerRoleDto: UpdateManagerRoleDto,
    @Param('adminId') adminId: string,
  ) {
    updateManagerRoleDto.adminId = adminId;
    return await this.adminMgmtService.updateManagerRole(updateManagerRoleDto);
  }

  @Delete(':adminId')
  @UseGuards(JwtPartialAuthGuard, RolesGuard)
  @ResponseMessage('Admin deleted successfully')
  async deleteManager(@Param('adminId') adminId: string) {
    return await this.adminMgmtService.deleteManager(adminId);
  }
}
