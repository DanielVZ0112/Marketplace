# 📡 Data Fetching

## Visión General

El proyecto utiliza **React Query (TanStack Query)** para todas las operaciones de data fetching, proporcionando cache automático, refetch inteligente y manejo de estados.

## ⚙️ Configuración

**Archivo:** `shared/lib/react-query.ts`

```typescript
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30 segundos
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
```

## 🔌 Cliente HTTP

**Archivo:** `shared/lib/axios.ts`

### Configuración Base

```typescript
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Interceptores

#### Request Interceptor

Agrega token JWT automáticamente:

```typescript
apiClient.interceptors.request.use((config) => {
  const token = useSessionStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

#### Response Interceptor

Maneja errores globalmente:

```typescript
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejo de errores
    return Promise.reject(error);
  }
);
```

## 🎣 Hooks Personalizados

### Estructura

Cada módulo tiene hooks en `application/`:

```
catalog/
└── application/
    ├── useGetProducts.ts
    ├── useGetProduct.ts
    └── useGetCategories.ts
```

### Ejemplo: useGetProducts

```typescript
export function useGetProducts() {
  const filters = useCatalogFilters(...);
  
  const queryParams = useMemo(() => ({
    search: filters.search || undefined,
    category_id: filters.categoryId || undefined,
    // ...
  }), [filters]);
  
  return useQuery<Product[] | PaginatedProducts>({
    queryKey: queryKeys.products.list(filters),
    queryFn: () => CatalogApiRepository.getProducts(queryParams),
    staleTime: 30 * 1000,
  });
}
```

### Uso en Componentes

```tsx
function CatalogPage() {
  const { data, isLoading, isError } = useGetProducts();
  
  if (isLoading) return <SkeletonLoader />;
  if (isError) return <ErrorState />;
  
  return <ProductGrid products={data} />;
}
```

## 🔑 Query Keys

**Archivo:** `shared/lib/query-keys.ts`

### Organización

```typescript
export const queryKeys = {
  products: {
    all: ['products'],
    list: (filters) => ['products', 'list', filters],
    detail: (id) => ['products', 'detail', id],
  },
  categories: {
    lists: () => ['categories'],
  },
  auth: {
    all: ['auth'],
    profile: () => ['auth', 'profile'],
  },
  checkout: {
    all: ['checkout'],
    customerByUserId: () => ['checkout', 'customer'],
  },
  orders: {
    all: ['orders'],
    list: () => ['orders', 'list'],
    detail: (id) => ['orders', 'detail', id],
  },
};
```

### Invalidación

```typescript
queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
```

## 🔄 Mutations

### Ejemplo: useLogin

```typescript
export function useLogin() {
  const queryClient = useQueryClient();
  const setUser = useSessionStore((s) => s.setUser);
  
  return useMutation({
    mutationFn: (loginData: LoginDto) =>
      AuthApiRepository.login(loginData),
    onSuccess: (data) => {
      setUser(data.user, data.token);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
    },
  });
}
```

### Uso

```tsx
const loginMutation = useLogin();

const handleSubmit = (data) => {
  loginMutation.mutate(data, {
    onSuccess: () => {
      navigate('/');
    },
  });
};
```

## 📦 Repositories

### Estructura

Cada módulo tiene un Repository en `infrastructure/`:

```typescript
export class CatalogApiRepository {
  static async getProducts(filters?: any): Promise<Product[]> {
    const response = await apiClient.get('/products', { params: filters });
    return response.data.data || response.data;
  }
  
  static async getProduct(id: string): Promise<Product> {
    const response = await apiClient.get(`/products/${id}`);
    return response.data.data;
  }
}
```

## 🎯 Estados de Query

### Estados Disponibles

```typescript
const {
  data,           // Datos de la respuesta
  isLoading,      // Primera carga
  isFetching,     // Cualquier fetch (incluye refetch)
  isError,        // Hay error
  error,          // Objeto de error
  isSuccess,      // Carga exitosa
  refetch,        // Función para refetch manual
} = useGetProducts();
```

### Manejo de Estados

```tsx
if (isLoading) return <SkeletonLoader />;
if (isError) return <ErrorState error={error} />;
if (!data) return <EmptyState />;

return <ProductGrid products={data} />;
```

## 🔄 Cache y Refetch

### Stale Time

```typescript
staleTime: 30 * 1000 // Datos frescos por 30 segundos
```

### Refetch Automático

- Al montar componente
- Al reconectar red
- Al cambiar query key

### Refetch Manual

```tsx
const { refetch } = useGetProducts();

<button onClick={() => refetch()}>Actualizar</button>
```

## 🗑️ Invalidación

### Invalidar Queries

```typescript
// Invalidar todas las queries de productos
queryClient.invalidateQueries({ queryKey: queryKeys.products.all });

// Invalidar query específica
queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(id) });
```

### Uso en Mutations

```typescript
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
}
```

## 🎨 Optimistic Updates

### Ejemplo

```typescript
const addToCartMutation = useMutation({
  mutationFn: addItemToCart,
  onMutate: async (newItem) => {
    // Cancelar queries en curso
    await queryClient.cancelQueries({ queryKey: ['cart'] });
    
    // Snapshot del estado anterior
    const previousCart = queryClient.getQueryData(['cart']);
    
    // Actualizar optimísticamente
    queryClient.setQueryData(['cart'], (old) => [...old, newItem]);
    
    return { previousCart };
  },
  onError: (err, newItem, context) => {
    // Revertir en caso de error
    queryClient.setQueryData(['cart'], context.previousCart);
  },
});
```

## 📊 Paginación

### Implementación

```typescript
const { data } = useGetProducts();

// data puede ser:
// - Product[] (sin paginación)
// - PaginatedProducts (con paginación)

const isPaginated = data && 'data' in data && 'total' in data;
const products = isPaginated ? data.data : data;
```

## 🔍 Filtros y Búsqueda

### Sincronización con Query

```typescript
const filters = useCatalogFilters(...);

const { data } = useQuery({
  queryKey: queryKeys.products.list(filters), // Key incluye filtros
  queryFn: () => CatalogApiRepository.getProducts(filters),
});
```

**Ventaja:** Cambiar filtros automáticamente refetch con nueva query key.

## 🎯 Mejores Prácticas

### 1. Usar Hooks Personalizados

✅ **Bien:**
```tsx
const { data } = useGetProducts();
```

❌ **Mal:**
```tsx
const { data } = useQuery({
  queryKey: ['products'],
  queryFn: () => fetch('/api/products'),
});
```

### 2. Organizar Query Keys

✅ **Bien:**
```typescript
queryKeys.products.list(filters)
```

❌ **Mal:**
```typescript
['products', filters] // Sin estructura
```

### 3. Manejar Estados

✅ **Bien:**
```tsx
if (isLoading) return <Loader />;
if (isError) return <Error />;
return <Content data={data} />;
```

### 4. Invalidar Correctamente

✅ **Bien:**
```typescript
queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
```

## 📚 Recursos

- [React Query Docs](https://tanstack.com/query/latest)
- [Axios Docs](https://axios-http.com/)
