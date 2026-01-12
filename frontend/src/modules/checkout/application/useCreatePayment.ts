import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckoutApiRepository } from "../infrastructure/CheckoutApiRepository";
import { queryKeys } from "@/shared/lib/query-keys";
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
      // Invalidate queries related to orders
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
  });
}
