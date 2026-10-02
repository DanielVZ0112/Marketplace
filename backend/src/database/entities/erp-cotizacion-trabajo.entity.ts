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
import { ErpCotizacionItem } from './erp-cotizacion-item.entity';

@Entity('erp_cotizacion_trabajos')
export class ErpCotizacionTrabajo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  cotizacion_id: number;

  @Column({ type: 'integer' })
  orden: number;

  @Column({ type: 'boolean', default: false })
  requiere_diseno: boolean;

  @Column({ type: 'boolean', default: false })
  diseno_por_valor: boolean;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 2,
    default: 0,
    transformer: decimalTransformer,
  })
  valor_diseno: number;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 2,
    default: 0,
    transformer: decimalTransformer,
  })
  minutos_diseno: number;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    transformer: decimalTransformer,
  })
  margen_esperado: number;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
    transformer: decimalTransformer,
  })
  descuento_porcentaje: number;

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
  costo_diseno: number;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 2,
    transformer: decimalTransformer,
  })
  precio_diseno: number;

  @Column({ type: 'boolean', default: false })
  diseno_en_items: boolean;

  @ManyToOne(() => ErpCotizacion, (cotizacion) => cotizacion.trabajos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cotizacion_id' })
  cotizacion: ErpCotizacion;

  @OneToMany(() => ErpCotizacionItem, (item) => item.trabajo, {
    cascade: true,
  })
  items: ErpCotizacionItem[];
}
