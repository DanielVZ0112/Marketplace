import { Category } from '../../../../database/entities/category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';

export class CategoryMapper {
  static toEntity(dto: CreateCategoryDto): Category {
    const category = new Category();
    category.name = dto.name;
    category.slug = dto.slug;
    return category;
  }
}
