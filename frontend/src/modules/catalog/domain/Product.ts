import type { ProductVariant } from './ProductVariant';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  imageUrl?: string; 
  category_id: number;
  categoryId?: number;
  is_active?: boolean;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  variants?: ProductVariant[];
}
  