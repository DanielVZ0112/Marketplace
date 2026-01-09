import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductVariantsController } from './product-variants.controller';
import { CreateProductVariantUseCase } from './application/create-product-variant.usecase';
import { ListProductVariantsUseCase } from './application/list-product-variants.usecase';
import { GetProductVariantByIdUseCase } from './application/get-product-variant-by-id.usecase';
import { UpdateProductVariantUseCase } from './application/update-product-variant.usecase';
import { ProductVariantTypeOrmRepository } from './infrastructure/product-variant.typeorm.repository';
import { PRODUCT_VARIANT_REPOSITORY } from './domain/product-variant.repository';
import { ProductVariant } from '../../database/entities/product-variant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductVariant])],
  controllers: [ProductVariantsController],
  providers: [
    CreateProductVariantUseCase,
    ListProductVariantsUseCase,
    GetProductVariantByIdUseCase,
    UpdateProductVariantUseCase,
    {
      provide: PRODUCT_VARIANT_REPOSITORY,
      useClass: ProductVariantTypeOrmRepository,
    },
  ],
  exports: [PRODUCT_VARIANT_REPOSITORY],
})
export class ProductVariantsModule {}
