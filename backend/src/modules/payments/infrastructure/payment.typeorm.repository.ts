import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentRepository } from '../domain/payment.repository';
import { Payment } from '../../../database/entities/payment.entity';

@Injectable()
export class PaymentTypeOrmRepository implements PaymentRepository {
  constructor(
    @InjectRepository(Payment)
    private readonly typeOrmRepository: Repository<Payment>,
  ) {}

  async create(payment: Payment): Promise<Payment> {
    const newPayment = this.typeOrmRepository.create(payment);
    return await this.typeOrmRepository.save(newPayment);
  }

  async findAll(): Promise<Payment[]> {
    return await this.typeOrmRepository.find({
      relations: [
        'order',
        'order.customer',
        'order.items',
        'order.items.productVariant',
      ],
    });
  }

  async findById(id: string): Promise<Payment | null> {
    return await this.typeOrmRepository.findOne({
      where: { id: Number(id) },
      relations: [
        'order',
        'order.customer',
        'order.items',
        'order.items.productVariant',
      ],
    });
  }

  async findByOrderId(orderId: string): Promise<Payment[]> {
    return await this.typeOrmRepository.find({
      where: { order_id: Number(orderId) },
      relations: [
        'order',
        'order.customer',
        'order.items',
        'order.items.productVariant',
      ],
      order: { created_at: 'DESC' },
    });
  }

  async update(id: string, payment: Partial<Payment>): Promise<Payment> {
    await this.typeOrmRepository.update({ id: Number(id) }, payment);
    const updatedPayment = await this.findById(id);
    if (!updatedPayment) {
      throw new Error('Payment not found after update');
    }
    return updatedPayment;
  }
}
