import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { CotizacionTrabajoDto } from './cotizacion-trabajo.dto';

export class CalcularCotizacionDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CotizacionTrabajoDto)
  trabajos: CotizacionTrabajoDto[];
}
