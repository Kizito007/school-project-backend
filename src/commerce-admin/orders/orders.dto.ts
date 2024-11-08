import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  readonly qty: string;

  @IsNotEmpty()
  @IsString()
  readonly productId: string;

  @IsOptional()
  @IsString()
  readonly status: string;

  @IsNotEmpty()
  @IsNumber()
  readonly amount: number;
}
