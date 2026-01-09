import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { ProductVariantRepository } from '../domain/product-variant.repository';
import { ProductVariant } from '../../../database/entities/product-variant.entity';

@Injectable()
export class ProductVariantTypeOrmRepository implements ProductVariantRepository {
  constructor(
    @InjectRepository(ProductVariant)
    private readonly typeOrmRepository: Repository<ProductVariant>,
  ) {}

  async create(productVariant: ProductVariant): Promise<ProductVariant> {
    const newVariant = this.typeOrmRepository.create(productVariant);
    return await this.typeOrmRepository.save(newVariant);
  }

  async findAll(): Promise<ProductVariant[]> {
    return await this.typeOrmRepository.find({
      where: { deleted_at: IsNull() },
      relations: ['product'],
    });
  }

  async findById(id: string): Promise<ProductVariant | null> {
    return await this.typeOrmRepository.findOne({
      where: { id: Number(id), deleted_at: IsNull() },
      relations: ['product'],
    });
  }

  async update(id: string, productVariant: Partial<ProductVariant>): Promise<ProductVariant> {
    await this.typeOrmRepository.update(
      { id: Number(id), deleted_at: IsNull() },
      productVariant,
    );
    const updatedVariant = await this.findById(id);
    if (!updatedVariant) {
      throw new Error('ProductVariant not found after update');
    }
    return updatedVariant;
  }
}
