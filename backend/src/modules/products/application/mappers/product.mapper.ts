import { Product } from '../../../../database/entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';

export class ProductMapper {
  static toEntity(dto: CreateProductDto): Product {
    const product = new Product();
    product.name = dto.name;
    product.description = dto.description ?? '';
    product.price = dto.price;
    product.category_id = dto.category_id;
    product.is_active = dto.is_active ?? true;

    return product;
  }
}
