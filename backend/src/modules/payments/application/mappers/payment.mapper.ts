import { Payment } from '../../../../database/entities/payment.entity';
import { PaymentStatus } from '../../../../common/enums/payment-status.enum';
import { PaymentProvider } from '../../../../common/enums/payment-provider.enum';
import { CreatePaymentDto } from '../dto/create-payment.dto';

export class PaymentMapper {
  static toEntity(dto: CreatePaymentDto): Payment {
    const payment = Object.assign(new Payment(), {
      order_id: dto.order_id,
      amount: dto.amount,
      payment_method: dto.payment_method,
      payment_provider: dto.payment_provider || PaymentProvider.SIMULATED,
      payment_status: PaymentStatus.PENDING,
      transaction_id: dto.transaction_id || undefined,
      metadata: dto.metadata || undefined,
    } as Partial<Payment>);
    return payment;
  }
}
