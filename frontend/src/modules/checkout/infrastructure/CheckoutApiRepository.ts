import { api } from "@/shared/lib/axios";
import type { CreateCustomerDto, Customer } from "../domain/Customer";
import type { CreateOrderDto } from "../domain/CreateOrder";
import type { Order } from "../domain/Order";
import type { CreatePaymentDto, ProcessPaymentDto, Payment } from "../domain/CreatePayment";

export class CheckoutApiRepository {
  /**
   * Crear un customer
   */
  static async createCustomer(data: CreateCustomerDto): Promise<Customer> {
    const { data: response } = await api.post<{ data: Customer }>("/customers", data);
    return response.data;
  }

  /**
   * Obtener un customer por user_id (del usuario autenticado)
   */
  static async getCustomerByUserId(): Promise<Customer | null> {
    const { data: response } = await api.get<{ data: Customer | null }>(`/customers/by-user`);
    return response.data;
  }

  /**
   * Crear una orden
   */
  static async createOrder(data: CreateOrderDto): Promise<Order> {
    const { data: response } = await api.post<{ data: Order }>("/orders", data);
    return response.data;
  }

  /**
   * Crear un pago
   */
  static async createPayment(data: CreatePaymentDto): Promise<Payment> {
    const { data: response } = await api.post<{ data: Payment }>("/payments", data);
    return response.data;
  }

  /**
   * Procesar/confirmar un pago
   */
  static async processPayment(data: ProcessPaymentDto): Promise<Payment> {
    const { data: response } = await api.post<{ data: Payment }>("/payments/process", data);
    return response.data;
  }
}
