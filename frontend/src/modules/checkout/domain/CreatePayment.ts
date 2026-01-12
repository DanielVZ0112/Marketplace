/**
 * DTO para crear un pago
 */
export interface CreatePaymentDto {
  order_id: number;
  amount: number;
  payment_method: string; // "credit_card", "debit_card", "paypal", etc.
  payment_provider?: string; // "stripe", "paypal", "mercado_pago", "simulated"
  transaction_id?: string | null;
  metadata?: Record<string, any>;
}

/**
 * DTO para procesar un pago
 */
export interface ProcessPaymentDto {
  payment_id: string;
  simulate_success?: boolean;
}

/**
 * Payment domain entity
 */
export interface Payment {
  id: number;
  created_at?: string | Date;
  updated_at?: string | Date;
  order_id: number;
  amount: string | number;
  payment_method: string;
  payment_status: string; // "pending", "completed", "failed"
  payment_provider?: string | null;
  transaction_id?: string | null;
  metadata?: Record<string, any>;
  order?: {
    id: number;
    status: string;
    total: string | number;
    [key: string]: any;
  };
}
  