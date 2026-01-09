import { Injectable, Inject, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import type { ProductRepository } from '../domain/product.repository';
import { PRODUCT_REPOSITORY } from '../domain/product.repository';
import { Product } from '../../../database/entities/product.entity';

@Injectable()
export class GetProductByIdUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(id: string): Promise<Product> {
    try {
      const product = await this.productRepository.findById(id);
      
      if (!product) {
        throw new NotFoundException(`Producto con ID ${id} no encontrado`);
      }
      
      return product;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al obtener el producto');
    }
  }
}

