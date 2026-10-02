import { ErpCotizacion } from '../../../database/entities/erp-cotizacion.entity';

export const ERP_COTIZACION_REPOSITORY = Symbol('ErpCotizacionRepository');

export interface ErpCotizacionRepository {
  create(cotizacion: ErpCotizacion): Promise<ErpCotizacion>;
  findAll(): Promise<ErpCotizacion[]>;
  findById(id: string): Promise<ErpCotizacion | null>;
  update(cotizacion: ErpCotizacion): Promise<ErpCotizacion>;
  updateEstado(id: string, estado: string): Promise<ErpCotizacion | null>;
}
