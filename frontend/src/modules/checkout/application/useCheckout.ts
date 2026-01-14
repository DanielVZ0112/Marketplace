import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCartStore } from "@/shared/stores/cart.store";
import { useCreateCustomer } from "./useCreateCustomer";
import { useCreateOrder } from "./useCreateOrder";
import { useCreatePayment } from "./useCreatePayment";
import { useProcessPayment } from "./useProcessPayment";
import { useCreateUser } from "@/modules/auth/application/useCreateUser";
import { queryKeys } from "@/shared/lib/query-keys";
import type { CreateCustomerDto } from "../domain/Customer";
import type { CreatePaymentDto, ProcessPaymentDto } from "../domain/CreatePayment";

/**
 * DTO para el flujo completo de checkout
 */
export interface CheckoutDto {
  customer: CreateCustomerDto;
  wantsToRegister?: boolean;
  password?: string;
  payment_method?: string;
  payment_provider?: string;
  metadata?: Record<string, any>;
  simulate_success?: boolean;
}

/**
 * Resultado del checkout
 */
export interface CheckoutResult {
  customer: any;
  order: any;
  payment: any;
  processedPayment: any;
}

/**
 * Hook para realizar el checkout completo
 * Orquesta el flujo: User (opcional) → Customer → Order → Payment → Process Payment
 */
export function useCheckout() {
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const queryClient = useQueryClient();

  const createUserMutation = useCreateUser();
  const createCustomerMutation = useCreateCustomer();
  const createOrderMutation = useCreateOrder();
  const createPaymentMutation = useCreatePayment();
  const processPaymentMutation = useProcessPayment();

  return useMutation({
    mutationFn: async (checkoutData: CheckoutDto): Promise<CheckoutResult> => {
      let userId: number | null = checkoutData.customer.user_id || null;

      // 1. Crear User primero si quiere registrarse
      if (checkoutData.wantsToRegister && checkoutData.password && checkoutData.customer.email) {
        const newUser = await createUserMutation.mutateAsync({
          email: checkoutData.customer.email,
          password: checkoutData.password,
        });
        userId = newUser.id;
      }

      // 2. Crear Customer con user_id si se creó User
      const customerData = {
        ...checkoutData.customer,
        user_id: userId || undefined,
      };
      const customer = await createCustomerMutation.mutateAsync(customerData);

      // 3. Crear Order
      const order = await createOrderMutation.mutateAsync({
        customer_id: customer.id,
        user_id: userId || null,
        status: "pending",
        items: items.map((item) => {
          if (!item.variant) {
            throw new Error(`El producto ${item.product.name} requiere una variante seleccionada`);
          }
          return {
            product_variant_id: item.variant.id,
            quantity: item.quantity,
            unit_price: Number(item.variant.price ?? item.product.price),
          };
        }),
      });

      // 4. Crear Payment
      const paymentData: CreatePaymentDto = {
        order_id: order.id,
        amount: Number(order.total),
        payment_method: checkoutData.payment_method || "credit_card",
        payment_provider: checkoutData.payment_provider || "simulated",
        metadata: checkoutData.metadata || {
          card_last4: "4242",
          card_brand: "visa",
        },
      };

      const payment = await createPaymentMutation.mutateAsync(paymentData);

      // 5. Procesar Payment
      const processPaymentData: ProcessPaymentDto = {
        payment_id: payment.id.toString(),
        simulate_success: checkoutData.simulate_success !== false,
      };

      const processedPayment = await processPaymentMutation.mutateAsync(processPaymentData);

      // Validar que el pago fue exitoso
      if (processedPayment.payment_status !== "completed") {
        throw new Error("El pago fue rechazado o falló");
      }

      return {
        customer,
        order: processedPayment.order || order,
        payment: processedPayment,
        processedPayment,
      };
    },

    onSuccess: () => {
      // Limpiar carrito solo si todo fue exitoso
      clearCart();
      // Invalidar queries de productos para actualizar el stock
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}
