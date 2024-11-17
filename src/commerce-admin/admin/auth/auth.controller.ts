import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AdminLocalAuthGuard } from './admin-local-auth.guard';
import { AuthService } from './auth.service';
import {
  VerifyAnswerDto,
  VerifyEmailDto,
} from 'src/commerce-admin/auth/auth.dto';
import { ResponseMessage } from 'src/common/decorators';

@Controller('commerce/admin/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(AdminLocalAuthGuard)
  @ResponseMessage('Login successful')
  async loginAdmin(@Req() req) {
    return req.user;
  }

  @Post('send-email-token')
  @ResponseMessage('Email token sent successfully')
  async resendEmailVerification(@Body('email') email: string) {
    return await this.authService.sendEmailVerificationLink(email);
  }

  @Post('verify-email-token')
  @ResponseMessage('Token verified successfully')
  async verifyEmail(@Body() { token, userId }: VerifyEmailDto) {
    return await this.authService.verifyEmail(token, userId);
  }

  @Post('verify-security-answer')
  @ResponseMessage('Security answer verified successfully')
  async verifySecurityAnswer(
    @Body() { securityAnswer, adminId }: VerifyAnswerDto,
  ) {
    return await this.authService.verifySecurityAnswer(securityAnswer, adminId);
  }
}
