import { ProductVariant } from '../../../database/entities/product-variant.entity';

export const PRODUCT_VARIANT_REPOSITORY = Symbol('ProductVariantRepository');

export interface ProductVariantRepository {
  create(productVariant: ProductVariant): Promise<ProductVariant>;
  findAll(): Promise<ProductVariant[]>;
  findById(id: string): Promise<ProductVariant | null>;
  update(
    id: string,
    productVariant: Partial<ProductVariant>,
  ): Promise<ProductVariant>;
}
