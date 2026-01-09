import { IsNumber, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateProductVariantDto {
  @IsNumber()
  @IsNotEmpty()
  product_id: number;

  @IsString()
  @IsOptional()
  size?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @IsString()
  @IsOptional()
  sku?: string;
}

