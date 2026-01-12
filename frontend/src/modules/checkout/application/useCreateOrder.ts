import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckoutApiRepository } from "../infrastructure/CheckoutApiRepository";
import { queryKeys } from "@/shared/lib/query-keys";
import type { CreateOrderDto } from "../domain/CreateOrder";

/**
 * Hook para crear una orden
 */
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderData: CreateOrderDto) =>
      CheckoutApiRepository.createOrder(orderData),
    onSuccess: () => {
      // Invalidate queries related to orders
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
  });
}
