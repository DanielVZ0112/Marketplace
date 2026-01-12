import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckoutApiRepository } from "../infrastructure/CheckoutApiRepository";
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
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["products"] }); // Stock actualizado
    },
  });
}
