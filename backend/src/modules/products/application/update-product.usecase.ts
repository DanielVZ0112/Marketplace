import { Injectable, Inject, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import type { ProductRepository } from '../domain/product.repository';
import { PRODUCT_REPOSITORY } from '../domain/product.repository';
import { Product } from '../../../database/entities/product.entity';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(id: string, productData: UpdateProductDto): Promise<Product> {
    try {
      // Verificar que el producto existe
      const existingProduct = await this.productRepository.findById(id);
      if (!existingProduct) {
        throw new NotFoundException(`Producto con ID ${id} no encontrado`);
      }

      // Actualizar el producto
      return await this.productRepository.update(id, productData);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al actualizar el producto');
    }
  }
}

