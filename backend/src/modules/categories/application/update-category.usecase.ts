import {
  Injectable,
  Inject,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import type { CategoryRepository } from '../domain/category.repository';
import { CATEGORY_REPOSITORY } from '../domain/category.repository';
import { Category } from '../../../database/entities/category.entity';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(
    id: string,
    categoryData: UpdateCategoryDto,
  ): Promise<Category> {
    try {
      const existingCategory = await this.categoryRepository.findById(id);
      if (!existingCategory) {
        throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
      }

      return await this.categoryRepository.update(id, categoryData);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error al actualizar la categoría',
      );
    }
  }
}
