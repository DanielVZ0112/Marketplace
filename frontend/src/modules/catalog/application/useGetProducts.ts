import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { CatalogApiRepository } from "../infrastructure/CatalogApiRepository";
import { useCatalogFilters } from "../../../shared/stores/filters.store";
import { queryKeys } from "@/shared/lib/query-keys";
import type { PaginatedProducts } from "../domain/ProductFilters";
import type { Product } from "../domain/Product";

export function useGetProducts() {
  const search = useCatalogFilters((s) => s.search);
  const categoryId = useCatalogFilters((s) => s.categoryId);
  const size = useCatalogFilters((s) => s.size);
  const color = useCatalogFilters((s) => s.color);
  const page = useCatalogFilters((s) => s.page);
  const limit = useCatalogFilters((s) => s.limit);
  const sortBy = useCatalogFilters((s) => s.sortBy);
  const order = useCatalogFilters((s) => s.order);

  const filters = useMemo(
    () => ({
      search,
      categoryId,
      size,
      color,
      page,
      limit,
      sortBy,
      order,
    }),
    [search, categoryId, size, color, page, limit, sortBy, order]
  );

  const queryParams = useMemo(
    () => {
      const params: any = {
        search: filters.search || undefined,
        category_id: filters.categoryId || undefined,
        size: filters.size || undefined,
        color: filters.color || undefined,
        page: filters.page || undefined,
        limit: filters.limit || undefined,
      };
      
      if (filters.sortBy) {
        params.sortBy = filters.sortBy;
        params.order = filters.order || "asc";
      }
      
      return params;
    },
    [filters]
  );

  return useQuery<Product[] | PaginatedProducts>({
    queryKey: queryKeys.products.list(filters),
    queryFn: () => CatalogApiRepository.getProducts(queryParams),
    staleTime: 30 * 1000,
  });
}
