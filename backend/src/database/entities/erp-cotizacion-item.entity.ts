import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { decimalTransformer } from '../transformers/decimal.transformer';
import { ErpCotizacion } from './erp-cotizacion.entity';
import { ErpCotizacionTrabajo } from './erp-cotizacion-trabajo.entity';
import { ErpCotizacionItemInsumo } from './erp-cotizacion-item-insumo.entity';

@Entity('erp_cotizacion_items')
export class ErpCotizacionItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  cotizacion_id: number;

  @Column({ type: 'integer' })
  trabajo_id: number;

  @Column({ type: 'varchar', length: 300 })
  descripcion_producto: string;

  @Column({ type: 'boolean', default: false })
  cliente_trae_prenda: boolean;

  @Column({ type: 'integer' })
  cantidad: number;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 2,
    transformer: decimalTransformer,
  })
  minutos_produccion: number;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 2,
    transformer: decimalTransformer,
  })
  costo_minuto: number;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 2,
    transformer: decimalTransformer,
  })
  depreciacion: number;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 2,
    transformer: decimalTransformer,
  })
  costo_fijo: number;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 2,
    transformer: decimalTransformer,
  })
  costo_prenda: number;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 2,
    transformer: decimalTransformer,
  })
  costo_tinta: number;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 2,
    transformer: decimalTransformer,
  })
  costo_papel: number;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 2,
    transformer: decimalTransformer,
  })
  costo_cinta: number;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 2,
    transformer: decimalTransformer,
  })
  costo_empaque: number;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 2,
    transformer: decimalTransformer,
  })
  costo_unitario: number;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 2,
    transformer: decimalTransformer,
  })
  precio_unitario: number;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 2,
    transformer: decimalTransformer,
  })
  subtotal: number;

  @ManyToOne(() => ErpCotizacion, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cotizacion_id' })
  cotizacion: ErpCotizacion;

  @ManyToOne(() => ErpCotizacionTrabajo, (trabajo) => trabajo.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'trabajo_id' })
  trabajo: ErpCotizacionTrabajo;

  @OneToMany(() => ErpCotizacionItemInsumo, (insumo) => insumo.item, {
    cascade: true,
  })
  insumos: ErpCotizacionItemInsumo[];
}
