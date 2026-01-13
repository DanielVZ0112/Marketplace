import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/modules/auth/domain/User";
import type { Customer } from "@/modules/checkout/domain/Customer";

interface SessionState {
  token: string | null;
  user: User | null;
  customer: Customer | null;
  isAuthenticated: boolean;

  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  setCustomer: (customer: Customer | null) => void;
  clearSession: () => void;
  initializeFromStorage: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      customer: null,
      isAuthenticated: false,

      setToken: (token) => {
        // Sincronizar con localStorage
        if (token) {
          localStorage.setItem("token", token);
        } else {
          localStorage.removeItem("token");
        }
        set({
          token,
          isAuthenticated: !!token,
        });
      },

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setCustomer: (customer) =>
        set({
          customer,
        }),

      clearSession: () => {
        localStorage.removeItem("token");
        set({
          token: null,
          user: null,
          customer: null,
          isAuthenticated: false,
        });
      },

      initializeFromStorage: () => {
        const token = localStorage.getItem("token");
        if (token && !get().token) {
          set({ token, isAuthenticated: true });
        }
      },
    }),
    {
      name: "marketplace-session",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        customer: state.customer,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
