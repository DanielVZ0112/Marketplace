# 🔄 Gestión de Estado

## Visión General

El proyecto utiliza **Zustand** para estado global y **React Query** para estado del servidor (data fetching).

## 🗄️ Zustand Stores

### Ubicación

Todos los stores están en `shared/stores/`:

- `cart.store.ts` - Estado del carrito
- `session.store.ts` - Estado de sesión
- `filters.store.ts` - Filtros del catálogo

## 🛒 Cart Store

**Archivo:** `shared/stores/cart.store.ts`

### Estado

```typescript
interface CartState {
  isOpen: boolean;
  items: CartItem[];
  
  // Actions
  openCart: () => void;
  closeCart: () => void;
  addItem: (product, variant?, quantity?) => void;
  removeItem: (productId, variantId?) => void;
  increaseItem: (productId, variantId?) => void;
  decreaseItem: (productId, variantId?) => void;
  clearCart: () => void;
  
  // Getters
  getTotalItems: () => number;
  getTotalPrice: () => number;
}
```

### Características

- ✅ Persistencia en localStorage
- ✅ Validación de stock
- ✅ Cálculo automático de totales

### Uso

```tsx
const items = useCartStore((s) => s.items);
const addItem = useCartStore((s) => s.addItem);
const getTotalPrice = useCartStore((s) => s.getTotalPrice);

addItem(product, variant, 2);
const total = getTotalPrice();
```

## 🔐 Session Store

**Archivo:** `shared/stores/session.store.ts`

### Estado

```typescript
interface SessionState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  customer: Customer | null;
  
  // Actions
  setUser: (user, token) => void;
  setCustomer: (customer) => void;
  clearSession: () => void;
  initializeFromStorage: () => void;
}
```

### Características

- ✅ Persistencia en localStorage
- ✅ Inicialización automática al cargar
- ✅ Sincronización con React Query

### Uso

```tsx
const isAuthenticated = useSessionStore((s) => s.isAuthenticated);
const user = useSessionStore((s) => s.user);
const setUser = useSessionStore((s) => s.setUser);
```

## 🔍 Filters Store

**Archivo:** `shared/stores/filters.store.ts`

### Estado

```typescript
interface CatalogFilters {
  search: string;
  categoryId: number | null;
  size: string | null;
  color: string | null;
  page: number;
  limit: number;
  sortBy: SortBy | null;
  order: SortOrder;
  
  // Actions
  setSearch: (search) => void;
  setCategoryId: (categoryId) => void;
  // ... más setters
  
  // Sync
  syncWithUrl: (params: URLSearchParams) => void;
  toUrlParams: () => URLSearchParams;
  clearFilters: () => void;
}
```

### Características

- ✅ Sincronización bidireccional con URL
- ✅ Reset de página al cambiar filtros
- ✅ Conversión de slugs a IDs

### Uso

```tsx
const search = useCatalogFilters((s) => s.search);
const setSearch = useCatalogFilters((s) => s.setSearch);
const clearFilters = useCatalogFilters((s) => s.clearFilters);
```

## 📡 React Query

**Configuración:** `shared/lib/react-query.ts`

### Query Client

```typescript
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30 segundos
      refetchOnWindowFocus: false,
    },
  },
});
```

### Hooks Personalizados

Cada módulo tiene sus hooks de data fetching:

```typescript
// catalog/application/useGetProducts.ts
export function useGetProducts() {
  const filters = useCatalogFilters(...);
  
  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: () => CatalogApiRepository.getProducts(filters),
  });
}
```

### Query Keys

**Archivo:** `shared/lib/query-keys.ts`

Organización centralizada de keys:

```typescript
export const queryKeys = {
  products: {
    all: ['products'],
    list: (filters) => ['products', 'list', filters],
    detail: (id) => ['products', 'detail', id],
  },
  // ...
};
```

## 🔄 Flujo de Estado

### Estado Local (useState)

Para estado que no se comparte:

```tsx
const [isOpen, setIsOpen] = useState(false);
```

### Estado Global (Zustand)

Para estado compartido entre componentes:

```tsx
const items = useCartStore((s) => s.items);
```

### Estado del Servidor (React Query)

Para datos del backend:

```tsx
const { data, isLoading } = useGetProducts();
```

## 💾 Persistencia

### localStorage

Stores con persistencia:

- ✅ `cart.store.ts` - Carrito persiste entre sesiones
- ✅ `session.store.ts` - Sesión persiste entre sesiones

### Implementación

```typescript
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // Estado y acciones
    }),
    {
      name: "marketplace-cart", // localStorage key
    }
  )
);
```

## 🎯 Selectores Optimizados

### Selectores Individuales

✅ **Bien:**
```tsx
const items = useCartStore((s) => s.items);
const addItem = useCartStore((s) => s.addItem);
```

❌ **Mal:**
```tsx
const { items, addItem } = useCartStore(); // Re-render en cada cambio
```

## 🔄 Sincronización

### URL ↔ Store

Los filtros se sincronizan automáticamente:

```tsx
// Al cambiar filtro
setCategoryId(1);
// → Actualiza URL automáticamente

// Al cargar página con URL
/catalog?category_id=1
// → Actualiza store automáticamente
```

## 📚 Recursos

- [Zustand Docs](https://zustand-demo.pmnd.rs/)
- [React Query Docs](https://tanstack.com/query/latest)
