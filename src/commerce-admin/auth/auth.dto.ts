import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}

export class VerifyEmailDto {
  @IsString()
  @IsNotEmpty()
  readonly token: string;

  @IsString()
  @IsNotEmpty()
  readonly userId: string;
}

export class VerifyAnswerDto {
  @IsString()
  @IsNotEmpty()
  readonly securityAnswer: string;

  @IsString()
  @IsNotEmpty()
  readonly adminId: string;
}
