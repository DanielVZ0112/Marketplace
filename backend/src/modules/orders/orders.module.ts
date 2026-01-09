import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { CreateOrderUseCase } from './application/create-order.usecase';
import { ListOrdersUseCase } from './application/list-orders.usecase';
import { GetOrderByIdUseCase } from './application/get-order-by-id.usecase';
import { UpdateOrderUseCase } from './application/update-order.usecase';
import { OrderTypeOrmRepository } from './infrastructure/order.typeorm.repository';
import { ORDER_REPOSITORY } from './domain/order.repository';
import { Order } from '../../database/entities/order.entity';
import { OrderItem } from '../../database/entities/order-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem])],
  controllers: [OrdersController],
  providers: [
    CreateOrderUseCase,
    ListOrdersUseCase,
    GetOrderByIdUseCase,
    UpdateOrderUseCase,
    {
      provide: ORDER_REPOSITORY,
      useClass: OrderTypeOrmRepository,
    },
  ],
  exports: [ORDER_REPOSITORY],
})
export class OrdersModule {}
