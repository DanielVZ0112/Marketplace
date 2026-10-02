import { ErpInsumo } from '../../../database/entities/erp-insumo.entity';

export const ERP_INSUMO_REPOSITORY = Symbol('ErpInsumoRepository');

export interface ErpInsumoRepository {
  create(insumo: ErpInsumo): Promise<ErpInsumo>;
  findAll(): Promise<ErpInsumo[]>;
  findById(id: string): Promise<ErpInsumo | null>;
  findByIds(ids: number[]): Promise<ErpInsumo[]>;
  update(id: string, insumo: Partial<ErpInsumo>): Promise<ErpInsumo>;
}
