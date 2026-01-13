import { Order } from '../../../../database/entities/order.entity';
import { OrderItem } from '../../../../database/entities/order-item.entity';
import { CreateOrderDto } from '../dto/create-order.dto';

export class OrderMapper {
  static toEntity(dto: CreateOrderDto): { order: Order; items: OrderItem[] } {
    const order = Object.assign(new Order(), {
      customer_id: dto.customer_id,
      user_id: dto.user_id || undefined,
      status: dto.status,
      total: dto.items.reduce((sum, item) => {
        return sum + (item.unit_price * item.quantity);
      }, 0),
    } as Partial<Order>);

    const items = dto.items.map(itemDto => {
      const item = new OrderItem();
      item.product_variant_id = itemDto.product_variant_id;
      item.quantity = itemDto.quantity;
      item.unit_price = itemDto.unit_price;
      item.total_price = itemDto.unit_price * itemDto.quantity;
      return item;
    });

    return { order, items };
  }
}

