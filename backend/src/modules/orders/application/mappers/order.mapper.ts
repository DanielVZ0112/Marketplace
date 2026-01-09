import { Order } from '../../../../database/entities/order.entity';
import { OrderItem } from '../../../../database/entities/order-item.entity';
import { CreateOrderDto } from '../dto/create-order.dto';

export class OrderMapper {
  static toEntity(dto: CreateOrderDto): { order: Order; items: OrderItem[] } {
    const order = new Order();
    order.customer_id = dto.customer_id;
    order.user_id = dto.user_id ?? 0;
    order.status = dto.status;
    
    order.total = dto.items.reduce((sum, item) => {
      return sum + (item.unit_price * item.quantity);
    }, 0);

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

