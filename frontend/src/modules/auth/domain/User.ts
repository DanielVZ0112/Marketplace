export interface User {
  id: number;
  email: string;
  is_active: boolean;
  created_at?: string | Date;
  updated_at?: string | Date;
  customer?: import('@/modules/checkout/domain/Customer').Customer;
}
