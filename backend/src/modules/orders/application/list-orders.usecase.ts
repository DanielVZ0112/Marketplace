import {
  Injectable,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import type { OrderRepository } from '../domain/order.repository';
import { ORDER_REPOSITORY } from '../domain/order.repository';
import { Order } from '../../../database/entities/order.entity';

@Injectable()
export class ListOrdersUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(userId?: number): Promise<Order[]> {
    try {
      if (userId) {
        return await this.orderRepository.findByUserId(userId);
      }
      return await this.orderRepository.findAll();
    } catch {
      throw new InternalServerErrorException('Error al listar las órdenes');
    }
  }
}
