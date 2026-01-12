import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckoutApiRepository } from "../infrastructure/CheckoutApiRepository";
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
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
