import { Payment } from '../../../../database/entities/payment.entity';
import { PaymentStatus } from '../../../../common/enums/payment-status.enum';
import { PaymentProvider } from '../../../../common/enums/payment-provider.enum';
import { CreatePaymentDto } from '../dto/create-payment.dto';

export class PaymentMapper {
  static toEntity(dto: CreatePaymentDto): Payment {
    const payment = new Payment();
    payment.order_id = dto.order_id;
    payment.amount = dto.amount;
    payment.payment_method = dto.payment_method;
    payment.payment_provider = dto.payment_provider || PaymentProvider.SIMULATED;
    payment.payment_status = PaymentStatus.PENDING;
    payment.transaction_id = dto.transaction_id || '';
    payment.metadata = dto.metadata || {};
    return payment;
  }
}

