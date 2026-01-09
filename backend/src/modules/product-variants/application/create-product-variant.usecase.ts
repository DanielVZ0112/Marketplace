import { Injectable, Inject, InternalServerErrorException } from '@nestjs/common';
import type { ProductVariantRepository } from '../domain/product-variant.repository';
import { PRODUCT_VARIANT_REPOSITORY } from '../domain/product-variant.repository';
import { ProductVariant } from '../../../database/entities/product-variant.entity';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { ProductVariantMapper } from './mappers/product-variant.mapper';

@Injectable()
export class CreateProductVariantUseCase {
  constructor(
    @Inject(PRODUCT_VARIANT_REPOSITORY)
    private readonly productVariantRepository: ProductVariantRepository,
  ) {}

  async execute(variantData: CreateProductVariantDto): Promise<ProductVariant> {
    try {
      const variant = ProductVariantMapper.toEntity(variantData);
      return await this.productVariantRepository.create(variant);
    } catch (error) {
      throw new InternalServerErrorException('Error al crear la variante del producto');
    }
  }
}
