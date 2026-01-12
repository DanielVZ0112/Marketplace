import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckoutApiRepository } from "../infrastructure/CheckoutApiRepository";
import { queryKeys } from "@/shared/lib/query-keys";
import type { ProcessPaymentDto } from "../domain/CreatePayment";

/**
 * Hook para procesar/confirmar un pago
 */
export function useProcessPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (processPaymentData: ProcessPaymentDto) =>
      CheckoutApiRepository.processPayment(processPaymentData),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all }); // Stock actualizado
    },
  });
}
