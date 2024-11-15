import { IsString, IsOptional } from 'class-validator';
import { File } from 'src/common/dtos';

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

  @IsOptional()
  @IsString()
  departmentId: string;
}
