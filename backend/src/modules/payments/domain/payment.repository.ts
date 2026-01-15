import { Payment } from '../../../database/entities/payment.entity';

export const PAYMENT_REPOSITORY = Symbol('PaymentRepository');

export interface PaymentRepository {
  create(payment: Payment): Promise<Payment>;
  findAll(): Promise<Payment[]>;
  findById(id: string): Promise<Payment | null>;
  findByOrderId(orderId: string): Promise<Payment[]>;
  update(id: string, payment: Partial<Payment>): Promise<Payment>;
}
