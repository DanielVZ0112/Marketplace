import { useQuery } from "@tanstack/react-query";
import { CatalogApiRepository } from "../infrastructure/CatalogApiRepository";

export function useGetProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => CatalogApiRepository.getProducts(),
  });
}
