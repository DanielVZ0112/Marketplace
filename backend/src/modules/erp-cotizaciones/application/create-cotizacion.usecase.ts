import {
  Inject,
  Injectable,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import type { ErpCotizacionRepository } from '../domain/erp-cotizacion.repository';
import { ERP_COTIZACION_REPOSITORY } from '../domain/erp-cotizacion.repository';
import { ErpCotizacion } from '../../../database/entities/erp-cotizacion.entity';
import { CreateCotizacionDto } from './dto/create-cotizacion.dto';
import { CalcularCotizacionUseCase } from './calcular-cotizacion.usecase';
import { CotizacionMapper } from './mappers/cotizacion.mapper';

@Injectable()
export class CreateCotizacionUseCase {
  constructor(
    @Inject(ERP_COTIZACION_REPOSITORY)
    private readonly cotizacionRepository: ErpCotizacionRepository,
    private readonly calcularCotizacionUseCase: CalcularCotizacionUseCase,
  ) {}

  async execute(dto: CreateCotizacionDto): Promise<ErpCotizacion> {
    const calculada = await this.calcularCotizacionUseCase.execute(
      dto.trabajos,
    );
    try {
      return await this.cotizacionRepository.create(
        CotizacionMapper.toEntity(dto, calculada),
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al crear la cotización');
    }
  }
}
