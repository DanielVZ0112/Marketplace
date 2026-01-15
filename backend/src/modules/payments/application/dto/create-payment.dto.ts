import {
  IsNumber,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsObject,
} from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  @IsNotEmpty()
  order_id: number;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  payment_method: string; // credit_card, debit_card, paypal, etc.

  @IsString()
  @IsOptional()
  payment_provider?: string; // stripe, paypal, mercado_pago, simulated

  @IsString()
  @IsOptional()
  transaction_id?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
