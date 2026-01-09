import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { CreateProductUseCase } from './application/create-product.usecase';
import { ListProductsUseCase } from './application/list-products.usecase';
import { GetProductByIdUseCase } from './application/get-product-by-id.usecase';
import { UpdateProductUseCase } from './application/update-product.usecase';
import { ProductTypeOrmRepository } from './infrastructure/product.typeorm.repository';
import { PRODUCT_REPOSITORY } from './domain/product.repository';
import { Product } from '../../database/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [
    CreateProductUseCase,
    ListProductsUseCase,
    GetProductByIdUseCase,
    UpdateProductUseCase,
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductTypeOrmRepository,
    },
  ],
})
export class ProductsModule {}


