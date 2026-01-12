import { useQuery } from "@tanstack/react-query";
import { OrdersApiRepository } from "../infrastructure/OrdersApiRepository";
import { useSessionStore } from "@/shared/stores/session.store";

/**
 * Hook para obtener las órdenes del usuario autenticado
 */
export function useMyOrders() {
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ["orders", "my-orders"],
    queryFn: () => OrdersApiRepository.getMyOrders(),
    enabled: isAuthenticated, // Solo si está autenticado
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}
