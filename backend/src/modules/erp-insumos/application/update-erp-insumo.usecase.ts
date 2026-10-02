import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import type { ErpInsumoRepository } from '../domain/erp-insumo.repository';
import { ERP_INSUMO_REPOSITORY } from '../domain/erp-insumo.repository';
import type { ErpCategoriaRepository } from '../../erp-categorias/domain/erp-categoria.repository';
import { ERP_CATEGORIA_REPOSITORY } from '../../erp-categorias/domain/erp-categoria.repository';
import type { ErpProveedorRepository } from '../../erp-proveedores/domain/erp-proveedor.repository';
import { ERP_PROVEEDOR_REPOSITORY } from '../../erp-proveedores/domain/erp-proveedor.repository';
import { ErpInsumo } from '../../../database/entities/erp-insumo.entity';
import { UpdateErpInsumoDto } from './dto/update-erp-insumo.dto';
import { GetErpInsumoByIdUseCase } from './get-erp-insumo-by-id.usecase';

@Injectable()
export class UpdateErpInsumoUseCase {
  constructor(
    @Inject(ERP_INSUMO_REPOSITORY)
    private readonly insumoRepository: ErpInsumoRepository,
    private readonly getErpInsumoByIdUseCase: GetErpInsumoByIdUseCase,
    @Inject(ERP_CATEGORIA_REPOSITORY)
    private readonly categoriaRepository: ErpCategoriaRepository,
    @Inject(ERP_PROVEEDOR_REPOSITORY)
    private readonly proveedorRepository: ErpProveedorRepository,
  ) {}

  async execute(id: string, dto: UpdateErpInsumoDto): Promise<ErpInsumo> {
    try {
      await this.getErpInsumoByIdUseCase.execute(id);
      if (dto.categoria_id) {
        const categoria = await this.categoriaRepository.findById(
          dto.categoria_id,
        );
        if (!categoria) {
          throw new BadRequestException('La categoría no existe');
        }
      }
      if (dto.proveedor_id) {
        const proveedor = await this.proveedorRepository.findById(
          dto.proveedor_id,
        );
        if (!proveedor) {
          throw new BadRequestException('El proveedor no existe');
        }
      }
      return await this.insumoRepository.update(id, dto);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error al actualizar el insumo');
    }
  }
}
