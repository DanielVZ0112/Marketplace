import { Injectable, Inject, InternalServerErrorException } from '@nestjs/common';
import type { OrderRepository } from '../domain/order.repository';
import { ORDER_REPOSITORY } from '../domain/order.repository';
import { Order } from '../../../database/entities/order.entity';

@Injectable()
export class ListOrdersUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(): Promise<Order[]> {
    try {
      return await this.orderRepository.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Error al listar las órdenes');
    }
  }
}
