import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import type { ErpCotizacionRepository } from '../domain/erp-cotizacion.repository';
import { ERP_COTIZACION_REPOSITORY } from '../domain/erp-cotizacion.repository';
import { ErpCotizacion } from '../../../database/entities/erp-cotizacion.entity';

@Injectable()
export class ListCotizacionesUseCase {
  constructor(
    @Inject(ERP_COTIZACION_REPOSITORY)
    private readonly cotizacionRepository: ErpCotizacionRepository,
  ) {}

  async execute(): Promise<ErpCotizacion[]> {
    try {
      return await this.cotizacionRepository.findAll();
    } catch {
      throw new InternalServerErrorException(
        'Error al listar las cotizaciones',
      );
    }
  }
}
