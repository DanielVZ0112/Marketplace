import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/modules/cart/domain/CartItem";
import type { Product } from "@/modules/catalog/domain/Product";
import type { ProductVariant } from "@/modules/catalog/domain/ProductVariant";

interface CartState {
  isOpen: boolean;
  items: CartItem[];

  openCart: () => void;
  closeCart: () => void;

  addItem: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeItem: (productId: number, variantId?: number) => void;

  increaseItem: (productId: number, variantId?: number) => void;
  decreaseItem: (productId: number, variantId?: number) => void;

  clearCart: () => void;

  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      items: [],

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: (product, variant, quantity = 1) => {
        const items = [...get().items];

        const index = items.findIndex(
          (item) =>
            item.product.id === product.id &&
            (item.variant?.id ?? 0) === (variant?.id ?? 0)
        );

        const stock = variant?.stock ?? Infinity;

        if (index >= 0) {
          const newQty = items[index].quantity + quantity;
          items[index].quantity = Math.min(newQty, stock);
        } else {
          items.push({
            product,
            variant,
            quantity: Math.min(quantity, stock),
          });
        }

        set({ items });
      },

      removeItem: (productId, variantId) => {
        const items = get().items.filter(
          (item) =>
            !(
              item.product.id === productId &&
              (item.variant?.id ?? 0) === (variantId ?? 0)
            )
        );

        set({ items });
      },

      increaseItem: (productId, variantId) => {
        const currentItems = get().items;
        const items = [...currentItems];

        const index = items.findIndex(
          (item) =>
            item.product.id === productId &&
            (item.variant?.id ?? 0) === (variantId ?? 0)
        );

        if (index >= 0) {
          const stock = items[index].variant?.stock ?? Infinity;
          // Prevenir actualización si ya está en el máximo
          if (items[index].quantity < stock) {
            items[index] = { ...items[index], quantity: items[index].quantity + 1 };
            set({ items }); // Solo un set
          }
        }
      },

      decreaseItem: (productId, variantId) => {
        const currentItems = get().items;
        const items = [...currentItems];

        const index = items.findIndex(
          (item) =>
            item.product.id === productId &&
            (item.variant?.id ?? 0) === (variantId ?? 0)
        );

        if (index >= 0) {
          if (items[index].quantity <= 1) {
            // Eliminar item si cantidad es 1
            items.splice(index, 1);
          } else {
            // Decrementar cantidad
            items[index] = { ...items[index], quantity: items[index].quantity - 1 };
          }
          set({ items }); // Solo un set
        }
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () =>
        get().items.reduce((acc, item) => acc + item.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce((acc, item) => {
          const price = item.variant?.price ?? item.product.price;
          return acc + price * item.quantity;
        }, 0),
    }),
    {
      name: "marketplace-cart", // localStorage key
    }
  )
);
