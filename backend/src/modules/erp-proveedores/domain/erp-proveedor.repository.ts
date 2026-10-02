import { ErpProveedor } from '../../../database/entities/erp-proveedor.entity';

export const ERP_PROVEEDOR_REPOSITORY = Symbol('ErpProveedorRepository');

export interface ErpProveedorRepository {
  create(proveedor: ErpProveedor): Promise<ErpProveedor>;
  findAll(): Promise<ErpProveedor[]>;
  findById(id: number): Promise<ErpProveedor | null>;
}
