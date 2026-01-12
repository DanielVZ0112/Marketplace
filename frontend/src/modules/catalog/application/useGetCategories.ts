import { useQuery } from "@tanstack/react-query";
import { CatalogApiRepository } from "../infrastructure/CatalogApiRepository";
import { queryKeys } from "@/shared/lib/query-keys";

export function useGetCategories() {
  return useQuery({
    queryKey: queryKeys.categories.lists(),
    queryFn: () => CatalogApiRepository.getCategories(),
  });
}
