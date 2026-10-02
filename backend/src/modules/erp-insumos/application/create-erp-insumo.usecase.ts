import {
  Injectable,
  Inject,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import type { ErpInsumoRepository } from '../domain/erp-insumo.repository';
import { ERP_INSUMO_REPOSITORY } from '../domain/erp-insumo.repository';
import type { ErpCategoriaRepository } from '../../erp-categorias/domain/erp-categoria.repository';
import { ERP_CATEGORIA_REPOSITORY } from '../../erp-categorias/domain/erp-categoria.repository';
import type { ErpProveedorRepository } from '../../erp-proveedores/domain/erp-proveedor.repository';
import { ERP_PROVEEDOR_REPOSITORY } from '../../erp-proveedores/domain/erp-proveedor.repository';
import { ErpInsumo } from '../../../database/entities/erp-insumo.entity';
import { CreateErpInsumoDto } from './dto/create-erp-insumo.dto';
import { ErpInsumoMapper } from './mappers/erp-insumo.mapper';

@Injectable()
export class CreateErpInsumoUseCase {
  constructor(
    @Inject(ERP_INSUMO_REPOSITORY)
    private readonly insumoRepository: ErpInsumoRepository,
    @Inject(ERP_CATEGORIA_REPOSITORY)
    private readonly categoriaRepository: ErpCategoriaRepository,
    @Inject(ERP_PROVEEDOR_REPOSITORY)
    private readonly proveedorRepository: ErpProveedorRepository,
  ) {}

  async execute(dto: CreateErpInsumoDto): Promise<ErpInsumo> {
    try {
      await this.assertCatalogo(dto.categoria_id, dto.proveedor_id);
      return await this.insumoRepository.create(ErpInsumoMapper.toEntity(dto));
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al crear el insumo');
    }
  }

  private async assertCatalogo(
    categoriaId: number,
    proveedorId?: number | null,
  ): Promise<void> {
    const categoria = await this.categoriaRepository.findById(categoriaId);
    if (!categoria) {
      throw new BadRequestException('La categoría no existe');
    }
    if (proveedorId) {
      const proveedor = await this.proveedorRepository.findById(proveedorId);
      if (!proveedor) {
        throw new BadRequestException('El proveedor no existe');
      }
    }
  }
}
