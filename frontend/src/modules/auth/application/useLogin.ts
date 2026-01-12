import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthApiRepository } from "../infrastructure/AuthApiRepository";
import { useSessionStore } from "@/shared/stores/session.store";
import { queryKeys } from "@/shared/lib/query-keys";
import type { LoginDto } from "../domain/LoginDto";

/**
 * Hook para iniciar sesión
 */
export function useLogin() {
  const queryClient = useQueryClient();
  const setToken = useSessionStore((s) => s.setToken);
  const setUser = useSessionStore((s) => s.setUser);

  return useMutation({
    mutationFn: (loginData: LoginDto) => AuthApiRepository.login(loginData),
    onSuccess: (data) => {
      // Guardar token en localStorage (ya lo hace axios interceptor, pero también en Zustand)
      localStorage.setItem("token", data.access_token);
      setToken(data.access_token);
      setUser({
        id: data.user.id,
        email: data.user.email,
        is_active: true,
      });

      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile() });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
  });
}
