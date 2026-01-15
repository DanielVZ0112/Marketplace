import {
  Injectable,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import type { ProductVariantRepository } from '../domain/product-variant.repository';
import { PRODUCT_VARIANT_REPOSITORY } from '../domain/product-variant.repository';
import { ProductVariant } from '../../../database/entities/product-variant.entity';

@Injectable()
export class ListProductVariantsUseCase {
  constructor(
    @Inject(PRODUCT_VARIANT_REPOSITORY)
    private readonly productVariantRepository: ProductVariantRepository,
  ) {}

  async execute(): Promise<ProductVariant[]> {
    try {
      return await this.productVariantRepository.findAll();
    } catch {
      throw new InternalServerErrorException(
        'Error al listar las variantes de productos',
      );
    }
  }
}
