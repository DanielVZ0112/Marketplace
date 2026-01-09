import { Injectable, Inject, InternalServerErrorException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import type { OrderRepository } from '../domain/order.repository';
import { ORDER_REPOSITORY } from '../domain/order.repository';
import { Order } from '../../../database/entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderMapper } from './mappers/order.mapper';
import { OrderItem } from '../../../database/entities/order-item.entity';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepository,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async execute(orderData: CreateOrderDto): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { order, items } = OrderMapper.toEntity(orderData);
      
      const savedOrder = await this.orderRepository.create(order);
      
      items.forEach(item => {
        item.order_id = savedOrder.id;
      });

      await queryRunner.manager.save(OrderItem, items);

      await queryRunner.commitTransaction();

      const orderWithItems = await this.orderRepository.findById(savedOrder.id.toString());
      
      if (!orderWithItems) {
        throw new InternalServerErrorException('Error al recuperar la orden creada');
      }

      return orderWithItems;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error al crear la orden');
    } finally {
      await queryRunner.release();
    }
  }
}
