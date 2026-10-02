import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/lib/query-keys";
import { ErpApiRepository } from "../infrastructure/ErpApiRepository";
import type { CreateCotizacionDto, EstadoCotizacion, TrabajoInput } from "../domain/CotizacionErp";

export function useCalcularCotizacion() {
  return useMutation({
    mutationFn: (trabajos: TrabajoInput[]) => ErpApiRepository.calcularCotizacion(trabajos),
  });
}

export function useCrearCotizacion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateCotizacionDto) => ErpApiRepository.crearCotizacion(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.erp.cotizaciones() });
    },
  });
}

export function useGetCotizaciones() {
  return useQuery({
    queryKey: queryKeys.erp.cotizaciones(),
    queryFn: () => ErpApiRepository.getCotizaciones(),
  });
}

export function useGetCotizacion(id: number) {
  return useQuery({
    queryKey: queryKeys.erp.cotizacion(id),
    queryFn: () => ErpApiRepository.getCotizacionById(id),
    enabled: Number.isFinite(id) && id > 0,
  });
}

export function useActualizarCotizacion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: CreateCotizacionDto }) =>
      ErpApiRepository.updateCotizacion(id, dto),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.erp.cotizaciones() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.erp.cotizacion(variables.id),
      });
    },
  });
}

export function useUpdateEstadoCotizacion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: EstadoCotizacion }) =>
      ErpApiRepository.updateEstadoCotizacion(id, estado),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.erp.cotizaciones() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.erp.cotizacion(variables.id),
      });
    },
  });
}
