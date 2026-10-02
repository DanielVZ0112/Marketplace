import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import type { ErpCotizacionRepository } from '../domain/erp-cotizacion.repository';
import { ERP_COTIZACION_REPOSITORY } from '../domain/erp-cotizacion.repository';
import { ErpCotizacion } from '../../../database/entities/erp-cotizacion.entity';

@Injectable()
export class GetCotizacionByIdUseCase {
  constructor(
    @Inject(ERP_COTIZACION_REPOSITORY)
    private readonly cotizacionRepository: ErpCotizacionRepository,
  ) {}

  async execute(id: string): Promise<ErpCotizacion> {
    try {
      const cotizacion = await this.cotizacionRepository.findById(id);
      if (!cotizacion) {
        throw new NotFoundException(`Cotización con ID ${id} no encontrada`);
      }
      return cotizacion;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al obtener la cotización');
    }
  }
}
