import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CreatePaymentUseCase } from './application/create-payment.usecase';
import { ProcessPaymentUseCase } from './application/process-payment.usecase';
import { ListPaymentsUseCase } from './application/list-payments.usecase';
import { GetPaymentByIdUseCase } from './application/get-payment-by-id.usecase';
import { GetPaymentsByOrderUseCase } from './application/get-payments-by-order.usecase';
import { CreatePaymentDto } from './application/dto/create-payment.dto';
import { ProcessPaymentDto } from './application/dto/process-payment.dto';
import { HttpResponse } from '../../common/http/http-response';
import { Public } from '../auth/infrastructure/decorators/public.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly createPaymentUseCase: CreatePaymentUseCase,
    private readonly processPaymentUseCase: ProcessPaymentUseCase,
    private readonly listPaymentsUseCase: ListPaymentsUseCase,
    private readonly getPaymentByIdUseCase: GetPaymentByIdUseCase,
    private readonly getPaymentsByOrderUseCase: GetPaymentsByOrderUseCase,
  ) {}

  @Public()
  @Post()
  async create(@Body() paymentData: CreatePaymentDto) {
    const payment = await this.createPaymentUseCase.execute(paymentData);
    return HttpResponse.created(payment, 'Pago creado exitosamente');
  }
  @Public()
  @Post('process')
  async process(@Body() processPaymentData: ProcessPaymentDto) {
    const payment =
      await this.processPaymentUseCase.execute(processPaymentData);
    return HttpResponse.ok(payment, 'Pago procesado exitosamente');
  }

  @Get()
  async findAll() {
    const payments = await this.listPaymentsUseCase.execute();
    return HttpResponse.ok(payments, 'Pagos obtenidos exitosamente');
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const payment = await this.getPaymentByIdUseCase.execute(id);
    return HttpResponse.ok(payment, 'Pago obtenido exitosamente');
  }

  @Get('order/:orderId')
  async findByOrder(@Param('orderId') orderId: string) {
    const payments = await this.getPaymentsByOrderUseCase.execute(orderId);
    return HttpResponse.ok(
      payments,
      'Pagos de la orden obtenidos exitosamente',
    );
  }
}
