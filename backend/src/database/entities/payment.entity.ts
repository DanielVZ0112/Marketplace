import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseWithoutDeletedEntity } from './base-without-deleted.entity';
import { Order } from './order.entity';
import { PaymentStatus } from '../../common/enums/payment-status.enum';

@Entity('payments')
export class Payment extends BaseWithoutDeletedEntity {
  @Column({ type: 'integer' })
  order_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 50 })
  payment_method: string;

  @Column({ type: 'varchar', length: 20, default: PaymentStatus.PENDING })
  payment_status: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  payment_provider: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  transaction_id: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @ManyToOne(() => Order, (order) => order.payments)
  @JoinColumn({ name: 'order_id' })
  order: Order;
}

