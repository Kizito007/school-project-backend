import {
  IsNotEmpty,
  IsEnum,
  IsString,
  MaxLength,
  IsEmail,
  IsPhoneNumber,
  IsOptional,
  MinLength,
  IsDate,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { AdminRole } from './admin.enum';
import { File } from 'src/common/dtos';

export class AddManagerDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  readonly securityAnswer: string;

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

export class UpdateManagerRoleDto {
  @IsNotEmpty()
  @IsEnum(AdminRole)
  readonly role: string;

  adminId: string;
}
