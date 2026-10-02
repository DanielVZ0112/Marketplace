import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateErpProveedorDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombre: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  contacto?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  telefono?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  sitio_web?: string;
}
