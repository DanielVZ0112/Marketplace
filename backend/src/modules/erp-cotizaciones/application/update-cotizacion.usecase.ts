import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CotizacionEstado } from '../../../common/enums/cotizacion-estado.enum';
import { ErpCotizacion } from '../../../database/entities/erp-cotizacion.entity';
import type { ErpCotizacionRepository } from '../domain/erp-cotizacion.repository';
import { ERP_COTIZACION_REPOSITORY } from '../domain/erp-cotizacion.repository';
import { CalcularCotizacionUseCase } from './calcular-cotizacion.usecase';
import { CreateCotizacionDto } from './dto/create-cotizacion.dto';
import { CotizacionMapper } from './mappers/cotizacion.mapper';

const ESTADOS_EDITABLES = new Set<string>([
  CotizacionEstado.BORRADOR,
  CotizacionEstado.RECHAZADA,
]);

@Injectable()
export class UpdateCotizacionUseCase {
  constructor(
    @Inject(ERP_COTIZACION_REPOSITORY)
    private readonly cotizacionRepository: ErpCotizacionRepository,
    private readonly calcularCotizacionUseCase: CalcularCotizacionUseCase,
  ) {}

  async execute(id: string, dto: CreateCotizacionDto): Promise<ErpCotizacion> {
    const existing = await this.cotizacionRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Cotización con ID ${id} no encontrada`);
    }
    if (!ESTADOS_EDITABLES.has(existing.estado)) {
      throw new BadRequestException(
        'Solo se pueden modificar cotizaciones en borrador o rechazadas',
      );
    }

    const calculada = await this.calcularCotizacionUseCase.execute(
      dto.trabajos,
    );
    try {
      return await this.cotizacionRepository.update(
        CotizacionMapper.toReplacement(existing, dto, calculada),
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error al actualizar la cotización',
      );
    }
  }
}
