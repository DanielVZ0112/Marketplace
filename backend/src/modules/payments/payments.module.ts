import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsController } from './payments.controller';
import { CreatePaymentUseCase } from './application/create-payment.usecase';
import { ProcessPaymentUseCase } from './application/process-payment.usecase';
import { ListPaymentsUseCase } from './application/list-payments.usecase';
import { GetPaymentByIdUseCase } from './application/get-payment-by-id.usecase';
import { GetPaymentsByOrderUseCase } from './application/get-payments-by-order.usecase';
import { PaymentTypeOrmRepository } from './infrastructure/payment.typeorm.repository';
import { PAYMENT_REPOSITORY } from './domain/payment.repository';
import { Payment } from '../../database/entities/payment.entity';
import { OrdersModule } from '../orders/orders.module';
import { ProductVariantsModule } from '../product-variants/product-variants.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    OrdersModule,
    ProductVariantsModule,
  ],
  controllers: [PaymentsController],
  providers: [
    CreatePaymentUseCase,
    ProcessPaymentUseCase,
    ListPaymentsUseCase,
    GetPaymentByIdUseCase,
    GetPaymentsByOrderUseCase,
    {
      provide: PAYMENT_REPOSITORY,
      useClass: PaymentTypeOrmRepository,
    },
  ],
  exports: [PAYMENT_REPOSITORY],
})
export class PaymentsModule {}
