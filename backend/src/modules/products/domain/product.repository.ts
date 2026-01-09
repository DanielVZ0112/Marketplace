import { Product } from '../../../database/entities/product.entity';

export const PRODUCT_REPOSITORY = Symbol('ProductRepository');

export interface ProductRepository {
  create(product: Product): Promise<Product>;
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  update(id: string, product: Partial<Product>): Promise<Product>;
}

