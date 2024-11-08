import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';
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
  @IsNumber()
  readonly amount: number;

  @IsNotEmpty()
  @IsNumber()
  readonly percentageDiscount: number;

  @IsNotEmpty()
  @IsNumber()
  readonly availableStock: number;

  @IsNotEmpty()
  @IsNumber()
  readonly totalStock: number;

  @IsOptional()
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
