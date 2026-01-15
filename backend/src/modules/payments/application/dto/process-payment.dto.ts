import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class ProcessPaymentDto {
  @IsString()
  @IsNotEmpty()
  payment_id: string;

  @IsBoolean()
  @IsOptional()
  simulate_success?: boolean;
}
