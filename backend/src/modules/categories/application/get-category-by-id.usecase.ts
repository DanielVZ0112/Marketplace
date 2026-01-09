import { Injectable, Inject, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import type { CategoryRepository } from '../domain/category.repository';
import { CATEGORY_REPOSITORY } from '../domain/category.repository';
import { Category } from '../../../database/entities/category.entity';

@Injectable()
export class GetCategoryByIdUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(id: string): Promise<Category> {
    try {
      const category = await this.categoryRepository.findById(id);
      
      if (!category) {
        throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
      }
      
      return category;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al obtener la categoría');
    }
  }
}

