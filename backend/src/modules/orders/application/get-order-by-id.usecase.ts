import { Injectable, Inject, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import type { OrderRepository } from '../domain/order.repository';
import { ORDER_REPOSITORY } from '../domain/order.repository';
import { Order } from '../../../database/entities/order.entity';

@Injectable()
export class GetOrderByIdUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(id: string): Promise<Order> {
    try {
      const order = await this.orderRepository.findById(id);
      
      if (!order) {
        throw new NotFoundException(`Orden con ID ${id} no encontrada`);
      }
      
      return order;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al obtener la orden');
    }
  }
}

