import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { CategoryRepository } from '../domain/category.repository';
import { Category } from '../../../database/entities/category.entity';

@Injectable()
export class CategoryTypeOrmRepository implements CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly typeOrmRepository: Repository<Category>,
  ) {}

  async create(category: Category): Promise<Category> {
    const newCategory = this.typeOrmRepository.create(category);
    return await this.typeOrmRepository.save(newCategory);
  }

  async findAll(): Promise<Category[]> {
    return await this.typeOrmRepository.find({
      where: { deleted_at: IsNull() },
    });
  }

  async findById(id: string): Promise<Category | null> {
    return await this.typeOrmRepository.findOne({
      where: { id: Number(id), deleted_at: IsNull() },
    });
  }

  async update(id: string, category: Partial<Category>): Promise<Category> {
    await this.typeOrmRepository.update(
      { id: Number(id), deleted_at: IsNull() },
      category,
    );
    const updatedCategory = await this.findById(id);
    if (!updatedCategory) {
      throw new Error('Category not found after update');
    }
    return updatedCategory;
  }
}
