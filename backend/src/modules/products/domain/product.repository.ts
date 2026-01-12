import { Product } from '../../../database/entities/product.entity';
import { ProductFilters, PaginatedProducts } from './product-filters.interface';

export const PRODUCT_REPOSITORY = Symbol('ProductRepository');

export interface ProductRepository {
  create(product: Product): Promise<Product>;
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  update(id: string, product: Partial<Product>): Promise<Product>;
  findWithFilters(filters: ProductFilters): Promise<Product[]>;
  findWithFiltersPaginated(filters: ProductFilters): Promise<PaginatedProducts>;
}

