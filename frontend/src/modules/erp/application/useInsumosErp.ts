import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/lib/query-keys";
import { ErpApiRepository } from "../infrastructure/ErpApiRepository";
import type { InsumoErpInput } from "../domain/InsumoErp";

export function useGetInsumos() {
  return useQuery({
    queryKey: queryKeys.erp.insumos(),
    queryFn: () => ErpApiRepository.getInsumos(),
  });
}

export function useCreateInsumo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: InsumoErpInput) => ErpApiRepository.createInsumo(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.erp.insumos() });
    },
  });
}

export function useUpdateInsumo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InsumoErpInput> }) =>
      ErpApiRepository.updateInsumo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.erp.insumos() });
    },
  });
}
