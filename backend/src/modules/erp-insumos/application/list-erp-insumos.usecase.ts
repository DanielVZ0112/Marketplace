import {
  Injectable,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import type { ErpInsumoRepository } from '../domain/erp-insumo.repository';
import { ERP_INSUMO_REPOSITORY } from '../domain/erp-insumo.repository';
import { ErpInsumo } from '../../../database/entities/erp-insumo.entity';

@Injectable()
export class ListErpInsumosUseCase {
  constructor(
    @Inject(ERP_INSUMO_REPOSITORY)
    private readonly insumoRepository: ErpInsumoRepository,
  ) {}

  async execute(): Promise<ErpInsumo[]> {
    try {
      return await this.insumoRepository.findAll();
    } catch {
      throw new InternalServerErrorException('Error al listar los insumos');
    }
  }
}
