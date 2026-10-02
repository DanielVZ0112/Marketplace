import { Entity, Column } from 'typeorm';
import { BaseWithoutDeletedEntity } from './base-without-deleted.entity';

@Entity('erp_proveedores')
export class ErpProveedor extends BaseWithoutDeletedEntity {
  @Column({ type: 'varchar', length: 150 })
  nombre: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  contacto: string | null;

  @Column({ type: 'varchar', length: 40, nullable: true })
  telefono: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  sitio_web: string | null;
}
