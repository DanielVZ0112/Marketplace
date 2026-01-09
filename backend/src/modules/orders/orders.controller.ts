import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { CreateOrderUseCase } from './application/create-order.usecase';
import { ListOrdersUseCase } from './application/list-orders.usecase';
import { GetOrderByIdUseCase } from './application/get-order-by-id.usecase';
import { UpdateOrderUseCase } from './application/update-order.usecase';
import { CreateOrderDto } from './application/dto/create-order.dto';
import { UpdateOrderDto } from './application/dto/update-order.dto';
import { HttpResponse } from '../../common/http/http-response';
import { Public } from '../auth/infrastructure/decorators/public.decorator';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly listOrdersUseCase: ListOrdersUseCase,
    private readonly getOrderByIdUseCase: GetOrderByIdUseCase,
    private readonly updateOrderUseCase: UpdateOrderUseCase,
  ) {}

  @Public()
  @Post()
  async create(@Body() orderData: CreateOrderDto) {
    const order = await this.createOrderUseCase.execute(orderData);
    return HttpResponse.created(order, 'Orden creada exitosamente');
  }

  @Get()
  async findAll() {
    const orders = await this.listOrdersUseCase.execute();
    return HttpResponse.ok(orders, 'Órdenes obtenidas exitosamente');
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const order = await this.getOrderByIdUseCase.execute(id);
    return HttpResponse.ok(order, 'Orden obtenida exitosamente');
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() orderData: UpdateOrderDto) {
    const order = await this.updateOrderUseCase.execute(id, orderData);
    return HttpResponse.ok(order, 'Orden actualizada exitosamente');
  }
}
