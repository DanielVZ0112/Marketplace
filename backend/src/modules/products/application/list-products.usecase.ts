import { Injectable, Inject, InternalServerErrorException } from '@nestjs/common';
import type { ProductRepository } from '../domain/product.repository';
import { PRODUCT_REPOSITORY } from '../domain/product.repository';
import { Product } from '../../../database/entities/product.entity';

@Injectable()
export class ListProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(): Promise<Product[]> {
    try {
      return await this.productRepository.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Error al listar los productos');
    }
  }
}

