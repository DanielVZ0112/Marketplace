/**
 * Query keys centralizadas para React Query
 * Facilita la invalidación y gestión de cache
 */
export const queryKeys = {
  products: {
    all: ["products"] as const,
    lists: () => [...queryKeys.products.all, "list"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
  },
  categories: {
    all: ["categories"] as const,
    lists: () => [...queryKeys.categories.all, "list"] as const,
  },
  orders: {
    all: ["orders"] as const,
    myOrders: () => [...queryKeys.orders.all, "my-orders"] as const,
    details: () => [...queryKeys.orders.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.orders.details(), id] as const,
  },
  auth: {
    all: ["auth"] as const,
    profile: () => [...queryKeys.auth.all, "profile"] as const,
  },
  checkout: {
    all: ["checkout"] as const,
    customerByUserId: () =>
      [...queryKeys.checkout.all, "customer", "by-user"] as const,
  },
  erp: {
    parametros: () => ["erp", "parametros"] as const,
    categorias: () => ["erp", "categorias"] as const,
    proveedores: () => ["erp", "proveedores"] as const,
    insumos: () => ["erp", "insumos"] as const,
    cotizaciones: () => ["erp", "cotizaciones"] as const,
    cotizacion: (id: number) => ["erp", "cotizaciones", id] as const,
  },
} as const;
