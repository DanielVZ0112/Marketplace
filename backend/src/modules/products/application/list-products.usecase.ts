import { Injectable, Inject, InternalServerErrorException } from '@nestjs/common';
import type { ProductRepository } from '../domain/product.repository';
import { PRODUCT_REPOSITORY } from '../domain/product.repository';
import { Product } from '../../../database/entities/product.entity';
import { FilterProductsDto, SortBy, SortOrder } from './dto/filter-products.dto';
import { ProductFilters, PaginatedProducts } from '../domain/product-filters.interface';

@Injectable()
export class ListProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(filters?: FilterProductsDto): Promise<Product[] | PaginatedProducts> {
    try {
      const hasFilters = filters && this.hasFilters(filters);
      const hasPagination = filters && (filters.page || filters.limit);

      // Si hay paginación, usar método paginado
      if (hasPagination) {
        const domainFilters: ProductFilters = {
          search: filters.search,
          category_id: filters.category_id,
          size: filters.size,
          color: filters.color,
          min_price: filters.min_price,
          max_price: filters.max_price,
          page: filters.page,
          limit: filters.limit,
          sortBy: filters.sortBy as ProductFilters['sortBy'],
          order: filters.order as ProductFilters['order'],
        };
        return await this.productRepository.findWithFiltersPaginated(domainFilters);
      }

      // Si hay filtros pero no paginación, usar método normal
      if (hasFilters) {
        const domainFilters: ProductFilters = {
          search: filters.search,
          category_id: filters.category_id,
          size: filters.size,
          color: filters.color,
          min_price: filters.min_price,
          max_price: filters.max_price,
          sortBy: filters.sortBy as ProductFilters['sortBy'],
          order: filters.order as ProductFilters['order'],
        };
        return await this.productRepository.findWithFilters(domainFilters);
      }

      // Sin filtros ni paginación, retornar todos
      return await this.productRepository.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Error al listar los productos');
    }
  }

  private hasFilters(filters: FilterProductsDto): boolean {
    return !!(
      filters.search ||
      filters.category_id ||
      filters.size ||
      filters.color ||
      filters.min_price !== undefined ||
      filters.max_price !== undefined ||
      filters.sortBy ||
      filters.order
    );
  }
}

