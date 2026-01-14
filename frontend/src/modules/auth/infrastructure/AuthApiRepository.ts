import { api } from "@/shared/lib/axios";
import type { LoginDto } from "../domain/LoginDto";
import type { LoginResponse } from "../domain/LoginResponse";
import type { User } from "../domain/User";
import type { CreateUserDto } from "../domain/CreateUserDto";

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

  /**
   * Crear un usuario
   */
  static async createUser(data: CreateUserDto): Promise<User> {
    const { data: response } = await api.post<{ data: User }>("/users", data);
    return response.data;
  }
}
