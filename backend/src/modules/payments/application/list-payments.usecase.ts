import {
  Injectable,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import type { PaymentRepository } from '../domain/payment.repository';
import { PAYMENT_REPOSITORY } from '../domain/payment.repository';
import { Payment } from '../../../database/entities/payment.entity';

@Injectable()
export class ListPaymentsUseCase {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: PaymentRepository,
  ) {}

  async execute(): Promise<Payment[]> {
    try {
      return await this.paymentRepository.findAll();
    } catch {
      throw new InternalServerErrorException('Error al listar los pagos');
    }
  }
}
