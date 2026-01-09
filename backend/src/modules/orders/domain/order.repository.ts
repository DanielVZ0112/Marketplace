import { Order } from '../../../database/entities/order.entity';

export const ORDER_REPOSITORY = Symbol('OrderRepository');

export interface OrderRepository {
  create(order: Order): Promise<Order>;
  findAll(): Promise<Order[]>;
  findById(id: string): Promise<Order | null>;
  update(id: string, order: Partial<Order>): Promise<Order>;
}
