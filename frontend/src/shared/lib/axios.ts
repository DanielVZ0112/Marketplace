import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

// Interceptor de request: agrega el token a todas las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de response: maneja errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el error es 401 (no autorizado), limpiar sesión
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // Importar dinámicamente para evitar dependencias circulares
      import("@/shared/stores/session.store").then(({ useSessionStore }) => {
        useSessionStore.getState().clearSession();
      });
    }
    return Promise.reject(error);
  }
);
