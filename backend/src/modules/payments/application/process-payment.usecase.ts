import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import type { PaymentRepository } from '../domain/payment.repository';
import { PAYMENT_REPOSITORY } from '../domain/payment.repository';
import type { OrderRepository } from '../../orders/domain/order.repository';
import { ORDER_REPOSITORY } from '../../orders/domain/order.repository';
import type { ProductVariantRepository } from '../../product-variants/domain/product-variant.repository';
import { PRODUCT_VARIANT_REPOSITORY } from '../../product-variants/domain/product-variant.repository';
import { Payment } from '../../../database/entities/payment.entity';
import { PaymentStatus } from '../../../common/enums/payment-status.enum';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { ProductVariant } from '../../../database/entities/product-variant.entity';

@Injectable()
export class ProcessPaymentUseCase {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: PaymentRepository,
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepository,
    @Inject(PRODUCT_VARIANT_REPOSITORY)
    private readonly productVariantRepository: ProductVariantRepository,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async execute(processPaymentData: ProcessPaymentDto): Promise<Payment> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const payment = await this.paymentRepository.findById(
        processPaymentData.payment_id,
      );
      if (!payment) {
        throw new NotFoundException(
          `Pago con ID ${processPaymentData.payment_id} no encontrado`,
        );
      }

      if (payment.payment_status !== PaymentStatus.PENDING) {
        throw new BadRequestException(
          `El pago ya fue procesado. Estado actual: ${payment.payment_status}`,
        );
      }

      const order = await this.orderRepository.findById(
        payment.order_id.toString(),
      );
      if (!order) {
        throw new NotFoundException(
          `Orden con ID ${payment.order_id} no encontrada`,
        );
      }

      // Simular el procesamiento del pago
      const paymentSuccess = processPaymentData.simulate_success !== false;

      if (paymentSuccess) {
        payment.payment_status = PaymentStatus.COMPLETED;
        payment.transaction_id =
          payment.transaction_id || `TXN-${Date.now()}-${payment.id}`;
        payment.metadata = {
          ...payment.metadata,
          processed_at: new Date().toISOString(),
          simulated: true,
        };

        order.status = 'completed';

        if (order.items && order.items.length > 0) {
          for (const item of order.items) {
            const variant = await this.productVariantRepository.findById(
              item.product_variant_id.toString(),
            );
            if (!variant) {
              throw new NotFoundException(
                `Variante de producto con ID ${item.product_variant_id} no encontrada`,
              );
            }

            if (variant.stock < item.quantity) {
              throw new BadRequestException(
                `Stock insuficiente para la variante ${variant.id}. Disponible: ${variant.stock}, Solicitado: ${item.quantity}`,
              );
            }

            variant.stock = variant.stock - item.quantity;
            await queryRunner.manager.save(ProductVariant, variant);
          }
        }

        await queryRunner.manager.save(payment);
        await queryRunner.manager.save(order);

        await queryRunner.commitTransaction();

        const updatedPayment = await this.paymentRepository.findById(
          processPaymentData.payment_id,
        );
        if (!updatedPayment) {
          throw new InternalServerErrorException(
            'Error al recuperar el pago procesado',
          );
        }

        return updatedPayment;
      } else {
        payment.payment_status = PaymentStatus.FAILED;
        payment.metadata = {
          ...payment.metadata,
          processed_at: new Date().toISOString(),
          simulated: true,
          failure_reason: 'Simulación de pago fallido',
        };

        order.status = 'failed';

        await queryRunner.manager.save(payment);
        await queryRunner.manager.save(order);

        await queryRunner.commitTransaction();

        const updatedPayment = await this.paymentRepository.findById(
          processPaymentData.payment_id,
        );
        if (!updatedPayment) {
          throw new InternalServerErrorException(
            'Error al recuperar el pago procesado',
          );
        }

        return updatedPayment;
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error al procesar el pago');
    } finally {
      await queryRunner.release();
    }
  }
}
