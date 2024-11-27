import {
  IsNotEmpty,
  IsEnum,
  IsString,
  MaxLength,
  IsEmail,
  IsOptional,
  MinLength,
  IsDate,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { AdminRole, SecurityQuestion } from './admin.enum';
import { File } from 'src/common/dtos';

export class AddManagerDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @Transform(({ value }) => value.toLowerCase())
  readonly securityAnswer: string;

  @IsEnum(SecurityQuestion)
  @IsNotEmpty()
  readonly securityQuestion: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  @Transform(({ value }) => value.toLowerCase())
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @IsEnum(AdminRole)
  @IsNotEmpty()
  readonly role: string;

  @IsOptional()
  @IsDate()
  adminLastSeenTimestamp: Date;

  _username: string;

  addedById: string;

  photo: File;
}

export class SignInDto {
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  readonly password: string;
}

export class SendEmailDto {
  @IsNotEmpty()
  readonly subject: string;

  @IsNotEmpty()
  readonly text: string;
}

export class UpdateManagerRoleDto {
  @IsNotEmpty()
  @IsEnum(AdminRole)
  readonly role: string;

  adminId: string;
}

export class UploadTempFaceDto {
  photo: File;

  adminId: string;
}
