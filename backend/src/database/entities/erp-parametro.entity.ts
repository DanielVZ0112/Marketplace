import { Entity, Column } from 'typeorm';
import { BaseWithoutDeletedEntity } from './base-without-deleted.entity';
import { decimalTransformer } from '../transformers/decimal.transformer';

@Entity('erp_parametros')
export class ErpParametro extends BaseWithoutDeletedEntity {
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
  depreciacion_por_prenda: number;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 2,
    transformer: decimalTransformer,
  })
  costo_fijo_min: number;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 2,
    transformer: decimalTransformer,
  })
  costo_fijo_max: number;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 2,
    transformer: decimalTransformer,
  })
  costo_fijo_default: number;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 2,
    default: 1423500,
    transformer: decimalTransformer,
  })
  smlmv_base: number;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 2,
    default: 162000,
    transformer: decimalTransformer,
  })
  auxilio_transporte: number;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 2,
    default: 184,
    transformer: decimalTransformer,
  })
  horas_mes: number;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    default: 52,
    transformer: decimalTransformer,
  })
  porcentaje_prestaciones: number;

  @Column({ type: 'boolean', default: false })
  calculo_manual: boolean;
}
