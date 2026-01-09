import { create } from "zustand";

interface CartState {
  isOpen: boolean;
  totalItems: number;
  openCart: () => void;
  closeCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  isOpen: false,
  totalItems: 0,
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
}));
