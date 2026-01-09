import { ProductVariant } from '../../../../database/entities/product-variant.entity';
import { CreateProductVariantDto } from '../dto/create-product-variant.dto';

export class ProductVariantMapper {
  static toEntity(dto: CreateProductVariantDto): ProductVariant {
    const variant = new ProductVariant();
    variant.product_id = dto.product_id;
    variant.size = dto.size ?? '';
    variant.color = dto.color ?? '';
    variant.stock = dto.stock;
    variant.sku = dto.sku ?? '';
    return variant;
  }
}

