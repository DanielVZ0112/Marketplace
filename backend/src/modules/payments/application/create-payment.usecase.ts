import {
  Injectable,
  Inject,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import type { PaymentRepository } from '../domain/payment.repository';
import { PAYMENT_REPOSITORY } from '../domain/payment.repository';
import type { OrderRepository } from '../../orders/domain/order.repository';
import { ORDER_REPOSITORY } from '../../orders/domain/order.repository';
import { Payment } from '../../../database/entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentMapper } from './mappers/payment.mapper';

@Injectable()
export class CreatePaymentUseCase {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: PaymentRepository,
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(paymentData: CreatePaymentDto): Promise<Payment> {
    try {
      const order = await this.orderRepository.findById(
        paymentData.order_id.toString(),
      );
      if (!order) {
        throw new BadRequestException(
          `Orden con ID ${paymentData.order_id} no encontrada`,
        );
      }

      if (order.status === 'completed') {
        throw new BadRequestException('La orden ya está completada');
      }

      if (Number(paymentData.amount) !== Number(order.total)) {
        throw new BadRequestException(
          `El monto del pago (${paymentData.amount}) no coincide con el total de la orden (${order.total})`,
        );
      }

      const payment = PaymentMapper.toEntity(paymentData);
      return await this.paymentRepository.create(payment);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al crear el pago');
    }
  }
}
