import {
  Injectable,
  Inject,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import type { ErpInsumoRepository } from '../domain/erp-insumo.repository';
import { ERP_INSUMO_REPOSITORY } from '../domain/erp-insumo.repository';
import { ErpInsumo } from '../../../database/entities/erp-insumo.entity';

@Injectable()
export class GetErpInsumoByIdUseCase {
  constructor(
    @Inject(ERP_INSUMO_REPOSITORY)
    private readonly insumoRepository: ErpInsumoRepository,
  ) {}

  async execute(id: string): Promise<ErpInsumo> {
    try {
      const insumo = await this.insumoRepository.findById(id);
      if (!insumo) {
        throw new NotFoundException(`Insumo con ID ${id} no encontrado`);
      }
      return insumo;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al obtener el insumo');
    }
  }
}
