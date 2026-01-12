export type SortBy = 'name' | 'price' | 'created_at';
export type SortOrder = 'asc' | 'desc';

export interface ProductFilters {
  search?: string;
  category_id?: number;
  size?: string;
  color?: string;
  min_price?: number;
  max_price?: number;
  page?: number;
  limit?: number;
  sortBy?: SortBy;
  order?: SortOrder;
}

import type { Product } from "./Product";

export interface PaginatedProducts {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
