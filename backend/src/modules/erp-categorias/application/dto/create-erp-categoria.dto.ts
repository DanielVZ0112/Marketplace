import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateErpCategoriaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  nombre: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  descripcion?: string;
}
