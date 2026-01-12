import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  timeout: 10000,
});

// Interceptor de request: agrega el token a todas las peticiones
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de response: maneja errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Manejo de errores por código de estado
    if (error.response) {
      const status = error.response.status;

      switch (status) {
        case 401:
          // No autorizado - limpiar sesión
          localStorage.removeItem("token");
          import("@/shared/stores/session.store").then(({ useSessionStore }) => {
            useSessionStore.getState().clearSession();
          });
          // Redirigir a login usando router
          if (window.location.pathname !== "/login") {
            import("@/app/router").then(({ router }) => {
              router.navigate("/login", { replace: true });
            });
          }
          break;

        case 403:
          // Prohibido - usuario no tiene permisos
          console.error("Acceso prohibido:", error.response.data);
          break;

        case 404:
          // Recurso no encontrado
          console.error("Recurso no encontrado:", error.config?.url);
          break;

        case 422:
          // Error de validación
          console.error("Error de validación:", error.response.data);
          break;

        case 500:
        case 502:
        case 503:
          // Errores del servidor
          console.error("Error del servidor:", error.response.data);
          break;

        default:
          console.error("Error desconocido:", error.response.data);
      }
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      console.error("Sin respuesta del servidor:", error.request);
    } else {
      // Error al configurar la petición
      console.error("Error de configuración:", error.message);
    }

    return Promise.reject(error);
  }
);
