import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/lib/query-keys";
import type {
  CreateErpCategoriaInput,
  CreateErpProveedorInput,
} from "../domain/CatalogoErp";
import { ErpApiRepository } from "../infrastructure/ErpApiRepository";

export function useGetCategorias() {
  return useQuery({
    queryKey: queryKeys.erp.categorias(),
    queryFn: () => ErpApiRepository.getCategorias(),
  });
}

export function useCreateCategoria() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateErpCategoriaInput) =>
      ErpApiRepository.createCategoria(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.erp.categorias() });
    },
  });
}

export function useGetProveedores() {
  return useQuery({
    queryKey: queryKeys.erp.proveedores(),
    queryFn: () => ErpApiRepository.getProveedores(),
  });
}

export function useCreateProveedor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateErpProveedorInput) =>
      ErpApiRepository.createProveedor(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.erp.proveedores() });
    },
  });
}
