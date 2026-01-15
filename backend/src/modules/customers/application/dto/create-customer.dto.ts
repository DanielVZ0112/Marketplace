import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsNumber,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCustomerDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  @Transform(({ value }) => value?.trim())
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, {
    message: 'El nombre solo puede contener letras y espacios',
  })
  first_name: string;

  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El apellido es requerido' })
  @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El apellido no puede exceder 100 caracteres' })
  @Transform(({ value }) => value?.trim())
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, {
    message: 'El apellido solo puede contener letras y espacios',
  })
  last_name: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  document_number?: string;

  @IsDateString(
    {},
    {
      message:
        'La fecha de nacimiento debe tener un formato válido (YYYY-MM-DD)',
    },
  )
  @IsOptional()
  birth_date?: string;

  @IsString()
  @IsOptional()
  @Matches(
    /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
    {
      message: 'El teléfono debe tener un formato válido',
    },
  )
  @Transform(({ value }) => value?.trim())
  phone?: string;

  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  @IsOptional()
  @Transform(({ value }) => value?.trim().toLowerCase())
  email?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255, { message: 'La dirección no puede exceder 255 caracteres' })
  @Transform(({ value }) => value?.trim())
  address?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'La ciudad no puede exceder 100 caracteres' })
  @Transform(({ value }) => value?.trim())
  city?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'El país no puede exceder 100 caracteres' })
  @Transform(({ value }) => value?.trim())
  country?: string;

  @IsNumber({}, { message: 'El user_id debe ser un número' })
  @IsOptional()
  user_id?: number;
}
