import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { ProductRepository } from '../domain/product.repository';
import { Product } from '../../../database/entities/product.entity';
import { ProductFilters, PaginatedProducts } from '../domain/product-filters.interface';

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
      where: { deleted_at: IsNull(), is_active: true },
      relations: ['category', 'variants'],
    });
  }

  async findById(id: string): Promise<Product | null> {
    return await this.typeOrmRepository.findOne({
      where: { id: Number(id), deleted_at: IsNull() },
      relations: ['category', 'variants'],
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

  async findWithFilters(filters: ProductFilters): Promise<Product[]> {
    const queryBuilder = this.typeOrmRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.variants', 'variants')
      .where('product.deleted_at IS NULL')
      .andWhere('product.is_active = :isActive', { isActive: true });

    if (filters.search) {
      queryBuilder.andWhere('product.name ILIKE :search', {
        search: `%${filters.search}%`,
      });
    }

    if (filters.category_id) {
      queryBuilder.andWhere('product.category_id = :categoryId', {
        categoryId: filters.category_id,
      });
    }

    if (filters.size || filters.color) {
      // Filtrar por variantes que cumplan los criterios
      if (filters.size && filters.color) {
        queryBuilder.andWhere(
          'EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = product.id AND pv.deleted_at IS NULL AND pv.size = :size AND pv.color = :color)',
          { size: filters.size, color: filters.color },
        );
      } else if (filters.size) {
        queryBuilder.andWhere(
          'EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = product.id AND pv.deleted_at IS NULL AND pv.size = :size)',
          { size: filters.size },
        );
      } else if (filters.color) {
        queryBuilder.andWhere(
          'EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = product.id AND pv.deleted_at IS NULL AND pv.color = :color)',
          { color: filters.color },
        );
      }
    }

    if (filters.min_price !== undefined) {
      queryBuilder.andWhere('product.price >= :minPrice', {
        minPrice: filters.min_price,
      });
    }

    if (filters.max_price !== undefined) {
      queryBuilder.andWhere('product.price <= :maxPrice', {
        maxPrice: filters.max_price,
      });
    }

    // Ordenamiento
    if (filters.sortBy) {
      const order = filters.order || 'asc';
      const sortBy = filters.sortBy === 'created_at' ? 'product.created_at' : `product.${filters.sortBy}`;
      queryBuilder.orderBy(sortBy, order.toUpperCase() as 'ASC' | 'DESC');
    } else {
      // Ordenamiento por defecto
      queryBuilder.orderBy('product.created_at', 'DESC');
    }

    return queryBuilder.getMany();
  }

  async findWithFiltersPaginated(filters: ProductFilters): Promise<PaginatedProducts> {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.typeOrmRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.variants', 'variants')
      .where('product.deleted_at IS NULL')
      .andWhere('product.is_active = :isActive', { isActive: true });

    if (filters.search) {
      queryBuilder.andWhere('product.name ILIKE :search', {
        search: `%${filters.search}%`,
      });
    }

    if (filters.category_id) {
      queryBuilder.andWhere('product.category_id = :categoryId', {
        categoryId: filters.category_id,
      });
    }

    if (filters.size || filters.color) {
      if (filters.size && filters.color) {
        queryBuilder.andWhere(
          'EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = product.id AND pv.deleted_at IS NULL AND pv.size = :size AND pv.color = :color)',
          { size: filters.size, color: filters.color },
        );
      } else if (filters.size) {
        queryBuilder.andWhere(
          'EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = product.id AND pv.deleted_at IS NULL AND pv.size = :size)',
          { size: filters.size },
        );
      } else if (filters.color) {
        queryBuilder.andWhere(
          'EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = product.id AND pv.deleted_at IS NULL AND pv.color = :color)',
          { color: filters.color },
        );
      }
    }

    if (filters.min_price !== undefined) {
      queryBuilder.andWhere('product.price >= :minPrice', {
        minPrice: filters.min_price,
      });
    }

    if (filters.max_price !== undefined) {
      queryBuilder.andWhere('product.price <= :maxPrice', {
        maxPrice: filters.max_price,
      });
    }

    // Ordenamiento
    if (filters.sortBy) {
      const order = filters.order || 'asc';
      const sortBy = filters.sortBy === 'created_at' ? 'product.created_at' : `product.${filters.sortBy}`;
      queryBuilder.orderBy(sortBy, order.toUpperCase() as 'ASC' | 'DESC');
    } else {
      queryBuilder.orderBy('product.created_at', 'DESC');
    }

    // Contar el total antes de aplicar paginación
    const total = await queryBuilder.getCount();

    // Aplicar paginación
    const data = await queryBuilder.skip(skip).take(limit).getMany();

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }
}
