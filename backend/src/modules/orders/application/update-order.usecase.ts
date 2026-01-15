import {
  Injectable,
  Inject,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import type { OrderRepository } from '../domain/order.repository';
import { ORDER_REPOSITORY } from '../domain/order.repository';
import { Order } from '../../../database/entities/order.entity';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class UpdateOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(id: string, orderData: UpdateOrderDto): Promise<Order> {
    try {
      const existingOrder = await this.orderRepository.findById(id);
      if (!existingOrder) {
        throw new NotFoundException(`Orden con ID ${id} no encontrada`);
      }

      return await this.orderRepository.update(id, orderData as Partial<Order>);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al actualizar la orden');
    }
  }
}
