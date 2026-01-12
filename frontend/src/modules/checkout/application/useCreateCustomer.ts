import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckoutApiRepository } from "../infrastructure/CheckoutApiRepository";
import type { CreateCustomerDto } from "../domain/Customer";

/**
 * Hook para crear un customer
 */
export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (customerData: CreateCustomerDto) =>
      CheckoutApiRepository.createCustomer(customerData),
    onSuccess: () => {
      // Invalidar queries relacionadas si es necesario
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
}
