import { Transform } from 'class-transformer';
import {
  IsEmail,
  MaxLength,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
import { File } from 'src/common/dtos';

export class UserDto {
  readonly userId: string;
}

export class AddUserDto {
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  readonly securityAnswer: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  readonly gender: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @MinLength(8)
  @IsStrongPassword(
    {},
    {
      message:
        'password must be at least 8 chars long, contain a special symbol, an uppercase char and a number',
    },
  )
  password: string;

  @IsOptional()
  photo: File;
}
