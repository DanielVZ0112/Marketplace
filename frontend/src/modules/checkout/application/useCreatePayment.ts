import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckoutApiRepository } from "../infrastructure/CheckoutApiRepository";
import type { CreatePaymentDto } from "../domain/CreatePayment";

/**
 * Hook para crear un pago
 */
export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentData: CreatePaymentDto) =>
      CheckoutApiRepository.createPayment(paymentData),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}
