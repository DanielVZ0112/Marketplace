import { Category } from '../../../database/entities/category.entity';

export const CATEGORY_REPOSITORY = Symbol('CategoryRepository');

export interface CategoryRepository {
  create(category: Category): Promise<Category>;
  findAll(): Promise<Category[]>;
  findById(id: string): Promise<Category | null>;
  update(id: string, category: Partial<Category>): Promise<Category>;
}
