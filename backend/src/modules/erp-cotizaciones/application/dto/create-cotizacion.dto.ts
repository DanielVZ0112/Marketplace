import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { CotizacionTrabajoDto } from './cotizacion-trabajo.dto';

export class CreateCotizacionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  cliente_nombre: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  cliente_contacto: string;

  @IsOptional()
  @IsDateString()
  fecha?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CotizacionTrabajoDto)
  trabajos: CotizacionTrabajoDto[];
}
