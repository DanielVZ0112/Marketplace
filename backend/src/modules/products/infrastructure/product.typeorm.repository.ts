import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { ProductRepository } from '../domain/product.repository';
import { Product } from '../../../database/entities/product.entity';

@Injectable()
export class ProductTypeOrmRepository implements ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly typeOrmRepository: Repository<Product>,
  ) {}

  async create(product: Product): Promise<Product> {
    const newProduct = this.typeOrmRepository.create(product);
    return await this.typeOrmRepository.save(newProduct);
  }

  async findAll(): Promise<Product[]> {
    return await this.typeOrmRepository.find({
      where: { deleted_at: IsNull() },
      relations: ['category'],
    });
  }

  async findById(id: string): Promise<Product | null> {
    return await this.typeOrmRepository.findOne({
      where: { id: Number(id), deleted_at: IsNull() },
      relations: ['category'],
    });
  }

  async update(id: string, product: Partial<Product>): Promise<Product> {
    await this.typeOrmRepository.update(
      { id: Number(id), deleted_at: IsNull() },
      product,
    );
    const updatedProduct = await this.findById(id);
    if (!updatedProduct) {
      throw new Error('Product not found after update');
    }
    return updatedProduct;
  }
}

