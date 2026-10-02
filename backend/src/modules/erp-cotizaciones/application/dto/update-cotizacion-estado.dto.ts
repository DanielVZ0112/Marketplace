import { IsEnum } from 'class-validator';
import { CotizacionEstado } from '../../../../common/enums/cotizacion-estado.enum';

export class UpdateCotizacionEstadoDto {
  @IsEnum(CotizacionEstado)
  estado: CotizacionEstado;
}
