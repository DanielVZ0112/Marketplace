import { useMutation } from "@tanstack/react-query";
import { useSessionStore } from "@/shared/stores/session.store";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Hook para cerrar sesión
 */
export function useLogout() {
  const clearSession = useSessionStore((s) => s.clearSession);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Limpiar localStorage
      localStorage.removeItem("token");
      clearSession();
      
      // Limpiar todas las queries
      queryClient.clear();
    },
  });
}
