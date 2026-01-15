import {
  Injectable,
  Inject,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import type { PaymentRepository } from '../domain/payment.repository';
import { PAYMENT_REPOSITORY } from '../domain/payment.repository';
import { Payment } from '../../../database/entities/payment.entity';

@Injectable()
export class GetPaymentByIdUseCase {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: PaymentRepository,
  ) {}

  async execute(id: string): Promise<Payment> {
    try {
      const payment = await this.paymentRepository.findById(id);

      if (!payment) {
        throw new NotFoundException(`Pago con ID ${id} no encontrado`);
      }

      return payment;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al obtener el pago');
    }
  }
}
