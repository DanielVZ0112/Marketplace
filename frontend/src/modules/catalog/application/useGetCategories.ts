import { useQuery } from "@tanstack/react-query";
import { CatalogApiRepository } from "../infrastructure/CatalogApiRepository";

export function useGetCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => CatalogApiRepository.getCategories(),
  });
}
