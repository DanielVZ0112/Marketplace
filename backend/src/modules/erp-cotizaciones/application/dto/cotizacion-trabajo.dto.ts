import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNumber,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { CotizacionItemDto } from './cotizacion-item.dto';

export class CotizacionTrabajoDto {
  @IsBoolean()
  requiere_diseno: boolean;

  @IsBoolean()
  diseno_por_valor: boolean;

  @IsNumber()
  @Min(0)
  valor_diseno: number;

  @IsNumber()
  @Min(0)
  minutos_diseno: number;

  @IsNumber()
  @Min(0)
  @Max(99.99)
  margen_esperado: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  descuento_porcentaje: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CotizacionItemDto)
  items: CotizacionItemDto[];
}
