import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AdminLocalAuthGuard } from './admin-local-auth.guard';
import { AuthService } from './auth.service';
import { VerifyEmailDto } from 'src/commerce-admin/auth/auth.dto';
import { ResponseMessage } from 'src/common/decorators';

@Controller('commerce/admin/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(AdminLocalAuthGuard)
  async loginAdmin(@Req() req) {
    return req.user;
  }

  @Post('send-email-token')
  async resendEmailVerification(@Body('email') email: string) {
    return await this.authService.sendEmailVerificationLink(email);
  }

  @Post('verify-email-token')
  async verifyEmail(@Body() { token, userId }: VerifyEmailDto) {
    return await this.authService.verifyEmail(token, userId);
  }
}
