import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from './categories.controller';
import { CreateCategoryUseCase } from './application/create-category.usecase';
import { ListCategoriesUseCase } from './application/list-categories.usecase';
import { GetCategoryByIdUseCase } from './application/get-category-by-id.usecase';
import { UpdateCategoryUseCase } from './application/update-category.usecase';
import { CategoryTypeOrmRepository } from './infrastructure/category.typeorm.repository';
import { CATEGORY_REPOSITORY } from './domain/category.repository';
import { Category } from '../../database/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [
    CreateCategoryUseCase,
    ListCategoriesUseCase,
    GetCategoryByIdUseCase,
    UpdateCategoryUseCase,
    {
      provide: CATEGORY_REPOSITORY,
      useClass: CategoryTypeOrmRepository,
    },
  ],
})
export class CategoriesModule {}
