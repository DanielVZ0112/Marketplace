import { Entity, Column, OneToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Customer } from './customer.entity';
import { Order } from './order.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @OneToOne(() => Customer, (customer) => customer.user)
  customer: Customer;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
