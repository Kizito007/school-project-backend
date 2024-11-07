import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  Patch,
  Param,
} from '@nestjs/common';
import { AuthUser } from 'src/commerce-admin/auth/auth-user.decorator';
import { AdminMgmtService } from './admin-mgmt.service';
import { UserPayload } from 'src/commerce-admin/users/users.dto';
import { AddManagerDto, UpdateManagerRoleDto } from './admin-mgmt.dto';
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

@Controller('commerce/admin/admin-mgmt')
export class AdminMgmtController {
  constructor(private readonly adminMgmtService: AdminMgmtService) {}

  @Get('admins')
  @UseGuards(JwtPartialAuthGuard, RolesGuard)
  @ResponseMessage('Admins fetched successfully')
  async getAdmins() {
    return await this.adminMgmtService.getAdmins();
  }

  @Get('admins/stats')
  @UseGuards(JwtPartialAuthGuard, RolesGuard)
  @ResponseMessage('Admin stats fetched successfully')
  async getAdminStats() {
    return await this.adminMgmtService.getAdminStats();
  }

  @Get('admins/:adminId')
  @UseGuards(JwtPartialAuthGuard, RolesGuard)
  async getAdmin(@Param('adminId') adminId: string) {
    return await this.adminMgmtService.getAdmin('adminId', adminId);
  }

  @Post('admins')
  @UseGuards(JwtPartialAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN)
  async addManager(
    @Body() addManagerDto: AddManagerDto,
    @AuthUser() { userId }: UserPayload,
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
    return await this.adminMgmtService.addManager(addManagerDto);
  }

  @Patch('admins/:adminId/role')
  @UseGuards(JwtPartialAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN)
  async updateManagerRole(
    @Body() updateManagerRoleDto: UpdateManagerRoleDto,
    @Param('adminId') adminId: string,
  ) {
    updateManagerRoleDto.adminId = adminId;
    return await this.adminMgmtService.updateManagerRole(updateManagerRoleDto);
  }
}
