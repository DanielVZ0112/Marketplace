import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import type { ErpCotizacionRepository } from '../domain/erp-cotizacion.repository';
import { ERP_COTIZACION_REPOSITORY } from '../domain/erp-cotizacion.repository';
import { ErpCotizacion } from '../../../database/entities/erp-cotizacion.entity';
import { UpdateCotizacionEstadoDto } from './dto/update-cotizacion-estado.dto';

@Injectable()
export class UpdateCotizacionEstadoUseCase {
  constructor(
    @Inject(ERP_COTIZACION_REPOSITORY)
    private readonly cotizacionRepository: ErpCotizacionRepository,
  ) {}

  async execute(
    id: string,
    dto: UpdateCotizacionEstadoDto,
  ): Promise<ErpCotizacion> {
    try {
      const cotizacion = await this.cotizacionRepository.updateEstado(
        id,
        dto.estado,
      );
      if (!cotizacion) {
        throw new NotFoundException(`Cotización con ID ${id} no encontrada`);
      }
      return cotizacion;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error al actualizar el estado de la cotización',
      );
    }
  }
}
