import { Injectable, Inject, InternalServerErrorException } from '@nestjs/common';
import type { CategoryRepository } from '../domain/category.repository';
import { CATEGORY_REPOSITORY } from '../domain/category.repository';
import { Category } from '../../../database/entities/category.entity';

@Injectable()
export class ListCategoriesUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(): Promise<Category[]> {
    try {
      return await this.categoryRepository.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Error al listar las categorías');
    }
  }
}
