import { useQuery } from "@tanstack/react-query";
import { CatalogApiRepository } from "../infrastructure/CatalogApiRepository";
import { queryKeys } from "@/shared/lib/query-keys";

export function useGetProduct(id: string) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => CatalogApiRepository.getProductById(id),
    enabled: !!id,
  });
}
