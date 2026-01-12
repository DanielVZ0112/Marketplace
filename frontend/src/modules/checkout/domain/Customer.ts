/**
 * Customer domain entity
 * Representa un cliente en el sistema
 */
export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  document_number?: string | null;
  birth_date?: string | Date | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  user_id?: number | null;
  created_at?: string | Date;
  updated_at?: string | Date;
  deleted_at?: string | Date | null;
}

/**
 * DTO para crear un customer
 */
export interface CreateCustomerDto {
  first_name: string;
  last_name: string;
  document_number?: string;
  birth_date?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  country?: string;
  user_id?: number | null;
}
