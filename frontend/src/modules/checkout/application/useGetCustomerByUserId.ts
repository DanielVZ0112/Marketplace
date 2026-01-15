import { useQuery } from "@tanstack/react-query";
import { CheckoutApiRepository } from "../infrastructure/CheckoutApiRepository";
import type { Customer } from "../domain/Customer";
import { queryKeys } from "@/shared/lib/query-keys";

export function useGetCustomerByUserId(enabled: boolean = true) {
  return useQuery<Customer | null>({
    queryKey: queryKeys.checkout.customerByUserId(),
    queryFn: async () => {
      return await CheckoutApiRepository.getCustomerByUserId();
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}
