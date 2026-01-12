import { useQuery } from "@tanstack/react-query";
import { OrdersApiRepository } from "../infrastructure/OrdersApiRepository";
import { queryKeys } from "@/shared/lib/query-keys";

export function useOrder(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.orders.detail(id!),
    queryFn: () => OrdersApiRepository.getOrderById(id!),
    enabled: !!id,
  });
}
