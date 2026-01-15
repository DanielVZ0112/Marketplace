import {
  Injectable,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import type { PaymentRepository } from '../domain/payment.repository';
import { PAYMENT_REPOSITORY } from '../domain/payment.repository';
import { Payment } from '../../../database/entities/payment.entity';

@Injectable()
export class GetPaymentsByOrderUseCase {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: PaymentRepository,
  ) {}

  async execute(orderId: string): Promise<Payment[]> {
    try {
      return await this.paymentRepository.findByOrderId(orderId);
    } catch {
      throw new InternalServerErrorException(
        'Error al obtener los pagos de la orden',
      );
    }
  }
}
