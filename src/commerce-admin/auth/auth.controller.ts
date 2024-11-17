import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { AddUserDto } from '../users/users.dto';
import { LoginDto, VerifyEmailDto } from './auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthUser } from './auth-user.decorator';
import { UserDocument } from '../users/users.schema';
import { ResponseMessage } from 'src/common/decorators';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ResponseMessage('Login successful')
  async login(@Body() { email, password }: LoginDto) {
    return this.authService.login(email, password);
  }

  @Post('register')
  @ResponseMessage('Registration successful')
  async addUser(@Body() addUserDto: AddUserDto) {
    return await this.authService.registerUser(addUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  @ResponseMessage('User fetched successfully')
  async getAuthUser(@AuthUser() user: UserDocument) {
    return user;
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
