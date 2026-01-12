import { useQuery } from "@tanstack/react-query";
import { OrdersApiRepository } from "../infrastructure/OrdersApiRepository";
import { useSessionStore } from "@/shared/stores/session.store";
import { queryKeys } from "@/shared/lib/query-keys";

/**
 * Hook para obtener las órdenes del usuario autenticado
 */
export function useMyOrders() {
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.orders.myOrders(),
    queryFn: () => OrdersApiRepository.getMyOrders(),
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
  });
}
