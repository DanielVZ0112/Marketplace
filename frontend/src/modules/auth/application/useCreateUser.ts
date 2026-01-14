import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthApiRepository } from "../infrastructure/AuthApiRepository";
import type { CreateUserDto } from "../domain/CreateUserDto";
import type { User } from "../domain/User";
import { queryKeys } from "@/shared/lib/query-keys";

/**
 * Hook para crear un usuario
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation<User, Error, CreateUserDto>({
    mutationFn: (userData: CreateUserDto) =>
      AuthApiRepository.createUser(userData),
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
    },
  });
}
