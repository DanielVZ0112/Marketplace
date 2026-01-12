import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { CatalogApiRepository } from "../infrastructure/CatalogApiRepository";
import { useCatalogFilters } from "../../../shared/stores/filters.store";
import { queryKeys } from "@/shared/lib/query-keys";
import type { PaginatedProducts } from "../domain/ProductFilters";
import type { Product } from "../domain/Product";

export function useGetProducts() {
  // Usar selectores individuales para evitar recrear objetos en cada render
  const search = useCatalogFilters((s) => s.search);
  const categoryId = useCatalogFilters((s) => s.categoryId);
  const size = useCatalogFilters((s) => s.size);
  const color = useCatalogFilters((s) => s.color);
  const page = useCatalogFilters((s) => s.page);
  const limit = useCatalogFilters((s) => s.limit);
  const sortBy = useCatalogFilters((s) => s.sortBy);
  const order = useCatalogFilters((s) => s.order);

  // Memoizar los filtros para la query key y la función
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
    () => ({
      search: filters.search || undefined,
      category_id: filters.categoryId || undefined,
      size: filters.size || undefined,
      color: filters.color || undefined,
      page: filters.page || undefined,
      limit: filters.limit || undefined,
      sortBy: filters.sortBy || undefined,
      order: filters.order || undefined,
    }),
    [filters]
  );

  return useQuery<Product[] | PaginatedProducts>({
    queryKey: queryKeys.products.list(filters),
    queryFn: () => CatalogApiRepository.getProducts(queryParams),
    staleTime: 30 * 1000, // 30 segundos
  });
}
