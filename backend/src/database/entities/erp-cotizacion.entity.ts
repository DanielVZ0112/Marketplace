import { Entity, Column, OneToMany } from 'typeorm';
import { BaseWithoutDeletedEntity } from './base-without-deleted.entity';
import { decimalTransformer } from '../transformers/decimal.transformer';
import { CotizacionEstado } from '../../common/enums/cotizacion-estado.enum';
import { ErpCotizacionTrabajo } from './erp-cotizacion-trabajo.entity';

@Entity('erp_cotizaciones')
export class ErpCotizacion extends BaseWithoutDeletedEntity {
  @Column({ type: 'varchar', length: 200 })
  cliente_nombre: string;

  @Column({ type: 'varchar', length: 200 })
  cliente_contacto: string;

  @Column({ type: 'date' })
  fecha: string;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 2,
    transformer: decimalTransformer,
  })
  total_costo: number;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 2,
    transformer: decimalTransformer,
  })
  total_precio: number;

  @Column({ type: 'varchar', length: 20, default: CotizacionEstado.BORRADOR })
  estado: string;

  @OneToMany(() => ErpCotizacionTrabajo, (trabajo) => trabajo.cotizacion, {
    cascade: true,
  })
  trabajos: ErpCotizacionTrabajo[];
}
