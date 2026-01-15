import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderRepository } from '../domain/order.repository';
import { Order } from '../../../database/entities/order.entity';

@Injectable()
export class OrderTypeOrmRepository implements OrderRepository {
  constructor(
    @InjectRepository(Order)
    private readonly typeOrmRepository: Repository<Order>,
  ) {}

  async create(order: Order): Promise<Order> {
    const newOrder = this.typeOrmRepository.create(order);
    return await this.typeOrmRepository.save(newOrder);
  }

  async findAll(): Promise<Order[]> {
    return await this.typeOrmRepository.find({
      relations: ['customer', 'user', 'items', 'items.productVariant'],
    });
  }

  async findByUserId(userId: number): Promise<Order[]> {
    return await this.typeOrmRepository.find({
      where: { user_id: userId },
      relations: ['customer', 'user', 'items', 'items.productVariant'],
      order: { created_at: 'DESC' },
    });
  }

  async findById(id: string): Promise<Order | null> {
    return await this.typeOrmRepository.findOne({
      where: { id: Number(id) },
      relations: ['customer', 'user', 'items', 'items.productVariant'],
    });
  }

  async update(id: string, order: Partial<Order>): Promise<Order> {
    await this.typeOrmRepository.update({ id: Number(id) }, order);
    const updatedOrder = await this.findById(id);
    if (!updatedOrder) {
      throw new Error('Order not found after update');
    }
    return updatedOrder;
  }
}
