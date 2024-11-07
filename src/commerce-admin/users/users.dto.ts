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

export type UserPayload = Readonly<{
  email: string;
  userId: string;
  emailVerified: boolean;
}>;

export class AddUserDto {
  @IsNotEmpty()
  @IsString()
  readonly username: string;

  // @IsOptional()
  // @IsString()
  // readonly securityAnswer: string;

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
