import { useQuery } from "@tanstack/react-query";
import { OrdersApiRepository } from "../infrastructure/OrdersApiRepository";

export function useOrder(id: string | undefined) {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => OrdersApiRepository.getOrderById(id!),
    enabled: !!id,
  });
}
