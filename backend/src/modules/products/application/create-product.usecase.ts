import {
  Injectable,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import type { ProductRepository } from '../domain/product.repository';
import { PRODUCT_REPOSITORY } from '../domain/product.repository';
import { Product } from '../../../database/entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductMapper } from './mappers/product.mapper';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(productData: CreateProductDto): Promise<Product> {
    try {
      const product = ProductMapper.toEntity(productData);
      return await this.productRepository.create(product);
    } catch {
      throw new InternalServerErrorException('Error al crear el producto');
    }
  }
}
