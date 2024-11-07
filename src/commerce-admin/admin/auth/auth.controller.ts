import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AdminLocalAuthGuard } from './admin-local-auth.guard';
@Controller('commerce/admin/auth')
export class AuthController {
  constructor() {}

  @Post('login')
  @UseGuards(AdminLocalAuthGuard)
  async loginAdmin(@Req() req) {
    return req.user;
  }
}
