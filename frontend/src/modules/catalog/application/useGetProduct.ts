import { useQuery } from "@tanstack/react-query";
import { CatalogApiRepository } from "../infrastructure/CatalogApiRepository";

export function useGetProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => CatalogApiRepository.getProductById(id),
    enabled: !!id,
  });
}
