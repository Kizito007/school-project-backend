import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsNumberString,
} from 'class-validator';
import { File } from 'src/common/dtos';

export class AddProductDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly description: string;

  @IsOptional()
  @IsString()
  readonly status: string;

  @IsNotEmpty()
  @IsNumberString()
  readonly amount: number;

  @IsNotEmpty()
  @IsNumberString()
  readonly percentageDiscount: number;

  @IsNotEmpty()
  @IsNumberString()
  readonly availableStock: number;

  @IsNotEmpty()
  @IsNumberString()
  readonly totalStock: number;

  photo: File;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly description: string;

  @IsOptional()
  @IsString()
  readonly status: string;

  @IsOptional()
  @IsNumber()
  readonly amount: number;

  @IsOptional()
  @IsNumber()
  readonly percentageDiscount: number;

  @IsOptional()
  @IsNumber()
  readonly availableStock: number;

  @IsOptional()
  @IsNumber()
  readonly totalStock: number;

  @IsOptional()
  photo: File;

  productId: string;
}
