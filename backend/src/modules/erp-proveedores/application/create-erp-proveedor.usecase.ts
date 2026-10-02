import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ErpProveedor } from '../../../database/entities/erp-proveedor.entity';
import type { ErpProveedorRepository } from '../domain/erp-proveedor.repository';
import { ERP_PROVEEDOR_REPOSITORY } from '../domain/erp-proveedor.repository';
import { CreateErpProveedorDto } from './dto/create-erp-proveedor.dto';

@Injectable()
export class CreateErpProveedorUseCase {
  constructor(
    @Inject(ERP_PROVEEDOR_REPOSITORY)
    private readonly proveedorRepository: ErpProveedorRepository,
  ) {}

  async execute(dto: CreateErpProveedorDto): Promise<ErpProveedor> {
    try {
      const proveedor = new ErpProveedor();
      proveedor.nombre = dto.nombre.trim();
      proveedor.contacto = dto.contacto?.trim() || null;
      proveedor.telefono = dto.telefono?.trim() || null;
      proveedor.sitio_web = dto.sitio_web?.trim() || null;
      return await this.proveedorRepository.create(proveedor);
    } catch {
      throw new InternalServerErrorException('Error al crear el proveedor');
    }
  }
}
