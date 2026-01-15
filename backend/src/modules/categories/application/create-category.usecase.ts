import {
  Injectable,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import type { CategoryRepository } from '../domain/category.repository';
import { CATEGORY_REPOSITORY } from '../domain/category.repository';
import { Category } from '../../../database/entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryMapper } from './mappers/category.mapper';

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(categoryData: CreateCategoryDto): Promise<Category> {
    try {
      const category = CategoryMapper.toEntity(categoryData);
      return await this.categoryRepository.create(category);
    } catch {
      throw new InternalServerErrorException('Error al crear la categoría');
    }
  }
}
