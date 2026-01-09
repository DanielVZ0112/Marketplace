import { Injectable, Inject, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import type { ProductVariantRepository } from '../domain/product-variant.repository';
import { PRODUCT_VARIANT_REPOSITORY } from '../domain/product-variant.repository';
import { ProductVariant } from '../../../database/entities/product-variant.entity';

@Injectable()
export class GetProductVariantByIdUseCase {
  constructor(
    @Inject(PRODUCT_VARIANT_REPOSITORY)
    private readonly productVariantRepository: ProductVariantRepository,
  ) {}

  async execute(id: string): Promise<ProductVariant> {
    try {
      const variant = await this.productVariantRepository.findById(id);
      
      if (!variant) {
        throw new NotFoundException(`Variante de producto con ID ${id} no encontrada`);
      }
      
      return variant;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al obtener la variante del producto');
    }
  }
}

