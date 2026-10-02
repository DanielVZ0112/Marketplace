import { Entity, Column } from 'typeorm';
import { BaseWithoutDeletedEntity } from './base-without-deleted.entity';

@Entity('erp_categorias')
export class ErpCategoria extends BaseWithoutDeletedEntity {
  @Column({ type: 'varchar', length: 120 })
  nombre: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  descripcion: string | null;
}
