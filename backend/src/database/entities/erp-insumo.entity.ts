import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseWithoutDeletedEntity } from './base-without-deleted.entity';
import { decimalTransformer } from '../transformers/decimal.transformer';
import { ErpCategoria } from './erp-categoria.entity';
import { ErpProveedor } from './erp-proveedor.entity';

@Entity('erp_insumos')
export class ErpInsumo extends BaseWithoutDeletedEntity {
  @Column({ type: 'varchar', length: 150 })
  nombre: string;

  @Column({ type: 'varchar', length: 20 })
  unidad_medida: string;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 4,
    transformer: decimalTransformer,
  })
  costo_unitario: number;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 4,
    transformer: decimalTransformer,
  })
  stock_actual: number;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 4,
    transformer: decimalTransformer,
  })
  stock_minimo: number;

  @Column({ type: 'integer' })
  categoria_id: number;

  @Column({ type: 'integer', nullable: true })
  proveedor_id: number | null;

  @ManyToOne(() => ErpCategoria, { nullable: false })
  @JoinColumn({ name: 'categoria_id' })
  categoria: ErpCategoria;

  @ManyToOne(() => ErpProveedor, { nullable: true })
  @JoinColumn({ name: 'proveedor_id' })
  proveedor: ErpProveedor | null;
}
