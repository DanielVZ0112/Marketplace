import type { Product } from './Product';

export interface ProductVariant {
  id: number;
  product_id: number;
  productId?: number; 
  size?: string | null;
  color?: string | null;
  stock: number;
  sku?: string | null;
  image_url?: string | null;
  imageUrl?: string | null; 
  price: number;
  created_at?: string | Date;
  updated_at?: string | Date;
  deleted_at?: string | Date | null;
  product?: Product;
}
  