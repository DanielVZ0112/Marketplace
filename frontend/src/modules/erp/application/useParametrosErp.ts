import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/lib/query-keys";
import { ErpApiRepository } from "../infrastructure/ErpApiRepository";
import type { UpdateParametrosErp } from "../domain/ParametrosErp";

export function useGetParametros() {
  return useQuery({
    queryKey: queryKeys.erp.parametros(),
    queryFn: () => ErpApiRepository.getParametros(),
  });
}

export function useUpdateParametros() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateParametrosErp) =>
      ErpApiRepository.updateParametros(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.erp.parametros() });
    },
  });
}
