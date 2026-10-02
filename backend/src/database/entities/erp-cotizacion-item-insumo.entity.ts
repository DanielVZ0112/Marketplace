import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { decimalTransformer } from '../transformers/decimal.transformer';
import { ErpCotizacionItem } from './erp-cotizacion-item.entity';
import { ErpInsumo } from './erp-insumo.entity';

@Entity('erp_cotizacion_item_insumos')
export class ErpCotizacionItemInsumo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  cotizacion_item_id: number;

  @Column({ type: 'integer' })
  insumo_id: number;

  @Column({ type: 'varchar', length: 20 })
  rol: string;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 4,
    transformer: decimalTransformer,
  })
  cantidad_usada: number;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 4,
    transformer: decimalTransformer,
  })
  costo_unitario_snapshot: number;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 2,
    transformer: decimalTransformer,
  })
  costo_linea: number;

  @ManyToOne(() => ErpCotizacionItem, (item) => item.insumos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cotizacion_item_id' })
  item: ErpCotizacionItem;

  @ManyToOne(() => ErpInsumo, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'insumo_id' })
  insumo: ErpInsumo;
}
