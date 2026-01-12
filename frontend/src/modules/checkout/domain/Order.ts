import type { Customer } from './Customer';
import type { Payment } from './CreatePayment';

export interface Order {
  id: number;
  created_at?: string | Date;
  updated_at?: string | Date;
  customer_id: number;
  user_id?: number | null;
  status: string; // "pending", "completed", "failed", etc.
  total: string | number;
  customer?: Customer;
  user?: any; // User opcional
  items?: OrderItem[];
  payments?: Payment[];
}

/**
 * OrderItem domain entity
 */
export interface OrderItem {
  id: number;
  order_id: number;
  product_variant_id: number;
  quantity: number;
  unit_price: string | number;
  total_price: string | number;
  productVariant?: {
    id: number;
    product_id: number;
    size?: string | null;
    color?: string | null;
    stock: number;
    sku?: string | null;
    image_url?: string | null;
    product?: {
      id: number;
      name: string;
      price: string | number;
      image_url?: string | null;
    };
  };
}
  