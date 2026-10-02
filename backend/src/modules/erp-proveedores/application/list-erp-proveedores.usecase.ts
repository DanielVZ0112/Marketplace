import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ErpProveedor } from '../../../database/entities/erp-proveedor.entity';
import type { ErpProveedorRepository } from '../domain/erp-proveedor.repository';
import { ERP_PROVEEDOR_REPOSITORY } from '../domain/erp-proveedor.repository';

@Injectable()
export class ListErpProveedoresUseCase {
  constructor(
    @Inject(ERP_PROVEEDOR_REPOSITORY)
    private readonly proveedorRepository: ErpProveedorRepository,
  ) {}

  async execute(): Promise<ErpProveedor[]> {
    try {
      return await this.proveedorRepository.findAll();
    } catch {
      throw new InternalServerErrorException('Error al listar los proveedores');
    }
  }
}
