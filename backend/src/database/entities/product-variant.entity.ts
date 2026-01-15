import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Product } from './product.entity';
import { OrderItem } from './order-item.entity';

@Entity('product_variants')
export class ProductVariant extends BaseEntity {
  @Column({ type: 'integer' })
  product_id: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  size: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  color: string;

  @Column({ type: 'integer', default: 0 })
  stock: number;

  @Column({ type: 'varchar', length: 100, nullable: true, unique: true })
  sku: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  image_url: string;

  @ManyToOne(() => Product, (product) => product.variants)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.productVariant)
  orderItems: OrderItem[];
}
