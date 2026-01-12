import { useQuery } from "@tanstack/react-query";
import { AuthApiRepository } from "../infrastructure/AuthApiRepository";
import { useSessionStore } from "@/shared/stores/session.store";

/**
 * Hook para obtener el perfil del usuario autenticado
 */
export function useProfile() {
  const token = useSessionStore((s) => s.token);
  const setUser = useSessionStore((s) => s.setUser);

  return useQuery({
    queryKey: ["auth", "profile"],
    queryFn: async () => {
      const user = await AuthApiRepository.getProfile();
      setUser(user); // Actualizar store
      return user;
    },
    enabled: !!token, // Solo si hay token
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}
