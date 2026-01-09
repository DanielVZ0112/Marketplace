import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseWithoutDeletedEntity } from './base-without-deleted.entity';
import { Customer } from './customer.entity';
import { User } from './user.entity';
import { OrderItem } from './order-item.entity';
import { Payment } from './payment.entity';

@Entity('orders')
export class Order extends BaseWithoutDeletedEntity {
  @Column({ type: 'integer' })
  customer_id: number;

  @Column({ type: 'integer', nullable: true })
  user_id: number;

  @Column({ type: 'varchar', length: 20 })
  status: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @ManyToOne(() => Customer, (customer) => customer.orders)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @ManyToOne(() => User, (user) => user.orders, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  items: OrderItem[];

  @OneToMany(() => Payment, (payment) => payment.order)
  payments: Payment[];
}


