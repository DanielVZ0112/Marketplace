import { ErpCategoria } from '../../../database/entities/erp-categoria.entity';

export const ERP_CATEGORIA_REPOSITORY = Symbol('ErpCategoriaRepository');

export interface ErpCategoriaRepository {
  create(categoria: ErpCategoria): Promise<ErpCategoria>;
  findAll(): Promise<ErpCategoria[]>;
  findById(id: number): Promise<ErpCategoria | null>;
}
