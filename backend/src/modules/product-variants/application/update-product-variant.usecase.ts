import { Injectable, Inject, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import type { ProductVariantRepository } from '../domain/product-variant.repository';
import { PRODUCT_VARIANT_REPOSITORY } from '../domain/product-variant.repository';
import { ProductVariant } from '../../../database/entities/product-variant.entity';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';

@Injectable()
export class UpdateProductVariantUseCase {
  constructor(
    @Inject(PRODUCT_VARIANT_REPOSITORY)
    private readonly productVariantRepository: ProductVariantRepository,
  ) {}

  async execute(id: string, variantData: UpdateProductVariantDto): Promise<ProductVariant> {
    try {
      const existingVariant = await this.productVariantRepository.findById(id);
      if (!existingVariant) {
        throw new NotFoundException(`Variante de producto con ID ${id} no encontrada`);
      }

      return await this.productVariantRepository.update(id, variantData);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al actualizar la variante del producto');
    }
  }
}

