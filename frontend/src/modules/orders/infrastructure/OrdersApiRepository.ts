import { api } from "@/shared/lib/axios";
import type { Order } from "@/modules/checkout/domain/Order";

export class OrdersApiRepository {
  /**
   * Obtener todas las órdenes del usuario autenticado
   */
  static async getMyOrders(): Promise<Order[]> {
    const { data: response } = await api.get<{ data: Order[] }>("/orders");
    return response.data;
  }

  /**
   * Obtener una orden por ID
   */
  static async getOrderById(id: string): Promise<Order> {
    const { data: response } = await api.get<{ data: Order }>(`/orders/${id}`);
    return response.data;
  }
}
