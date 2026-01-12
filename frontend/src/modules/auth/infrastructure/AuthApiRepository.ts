import { api } from "@/shared/lib/axios";
import type { LoginDto, LoginResponse } from "../domain/LoginDto";
import type { User } from "../domain/User";

export class AuthApiRepository {
  /**
   * Iniciar sesión
   */
  static async login(data: LoginDto): Promise<LoginResponse> {
    const { data: response } = await api.post<{ data: LoginResponse }>("/auth/login", data);
    return response.data;
  }

  /**
   * Obtener perfil del usuario autenticado
   */
  static async getProfile(): Promise<User> {
    const { data: response } = await api.get<{ data: User }>("/auth/profile");
    return response.data;
  }
}
