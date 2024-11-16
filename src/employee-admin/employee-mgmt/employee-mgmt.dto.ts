import { IsString, IsOptional, IsEnum } from 'class-validator';
import { File } from 'src/common/dtos';
import { Departments } from 'src/common/enums';

export class AddEmployeeDto {
  @IsOptional()
  @IsString()
  readonly firstname: string;

  @IsOptional()
  @IsString()
  readonly lastname: string;

  @IsOptional()
  @IsString()
  readonly role: string;

  @IsOptional()
  photo: File;

  @IsEnum(Departments)
  @IsOptional()
  department: Departments;
}
