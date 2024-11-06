import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { AddUserDto } from '../users/users.dto';
import { LoginDto, VerifyEmailDto } from './auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthUser } from './auth-user.decorator';
import { CommerceUserDocument } from '../users/users.schema';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() { email, password }: LoginDto) {
    return this.authService.login(email, password);
  }

  @Post('register')
  async addUser(@Body() addUserDto: AddUserDto) {
    return await this.authService.registerUser(addUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getAuthUser(@AuthUser() user: CommerceUserDocument) {
    return user;
  }

  @Post('resend-email-verification')
  async resendEmailVerification(@Body('email') email: string) {
    return await this.authService.sendEmailVerificationLink(email);
  }

  @Post('verify-email')
  async verifyEmail(@Body() { token, userId }: VerifyEmailDto) {
    return await this.authService.verifyEmail(token, userId);
  }
}
