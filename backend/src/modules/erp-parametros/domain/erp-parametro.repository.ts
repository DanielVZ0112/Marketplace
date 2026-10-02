import { ErpParametro } from '../../../database/entities/erp-parametro.entity';

export const ERP_PARAMETRO_REPOSITORY = Symbol('ErpParametroRepository');

export interface ErpParametroRepository {
  findOne(): Promise<ErpParametro | null>;
  update(id: number, data: Partial<ErpParametro>): Promise<ErpParametro>;
}
