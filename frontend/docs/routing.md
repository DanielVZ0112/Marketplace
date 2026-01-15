# 🚦 Sistema de Routing

## Visión General

El proyecto utiliza **React Router DOM v7** con **lazy loading** para optimizar la carga inicial y mejorar el performance.

## 📁 Configuración

**Archivo:** `app/router.tsx`

### Lazy Loading

Todas las rutas se cargan de forma diferida usando `lazy()`:

```tsx
const HomePage = lazy(() => import("@/modules/catalog/ui/pages/HomePage"));
const CatalogPage = lazy(() => import("@/modules/catalog/ui/pages/CatalogPage"));
```

### Suspense y Loading States

Cada ruta lazy está envuelta en `Suspense` con un skeleton loader:

```tsx
const LazyRoute = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<SkeletonLoader count={1} variant="page" />}>
    {children}
  </Suspense>
);
```

## 🗺️ Estructura de Rutas

```
/                    → HomePage
/catalog             → CatalogPage (con filtros en URL)
/catalog/:id         → ProductDetailPage
/checkout            → CheckoutPage
/checkout/success    → CheckoutSuccessPage
/login               → LoginPage
/orders              → MyOrdersPage (protegida)
/orders/:id          → OrderDetailPage (protegida)
```

## 🔒 Rutas Protegidas

### Implementación

Las rutas protegidas se manejan a nivel de componente:

```tsx
// En MyOrdersPage
const isAuthenticated = useSessionStore((s) => s.isAuthenticated);

if (!isAuthenticated) {
  return <Navigate to="/login" replace />;
}
```

## 🔄 Sincronización con URL

### Filtros en URL

Los filtros del catálogo se sincronizan con la URL:

```
/catalog?category=hombres&size=M&color=azul&page=2
```

**Implementación:** `shared/stores/filters.store.ts`

- `syncWithUrl()` - Lee parámetros de URL
- `toUrlParams()` - Convierte estado a URL
- Sincronización bidireccional

### Conversión de Slugs

El sistema convierte slugs de categorías a IDs:

```
/catalog?category=hombres → /catalog?category_id=1
```

## ⚡ Performance

### Code Splitting Automático

Vite crea chunks separados automáticamente:

```
dist/
├── index.js (200KB) - Código esencial
├── catalog.chunk.js (150KB) - Solo cuando se visita /catalog
├── checkout.chunk.js (200KB) - Solo cuando se visita /checkout
└── ...
```

### Beneficios

- ✅ Carga inicial 5x más rápida
- ✅ Solo descarga lo necesario
- ✅ Mejor caché (cambios en una ruta no afectan otras)

## 🎯 Navegación Programática

### useNavigate Hook

```tsx
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

// Navegar a ruta
navigate("/catalog");

// Navegar con estado
navigate("/checkout/success", { state: { order } });

// Navegar con reemplazo (sin historial)
navigate("/catalog", { replace: true });
```

### Links

```tsx
import { Link } from "react-router-dom";

<Link to="/catalog">Ver Catálogo</Link>
```

## 🔍 Parámetros de Ruta

### Parámetros Dinámicos

```tsx
// Ruta: /catalog/:id
const { id } = useParams<{ id: string }>();
```

### Query Parameters

```tsx
const [searchParams, setSearchParams] = useSearchParams();

// Leer
const category = searchParams.get("category");

// Escribir
setSearchParams({ category: "hombres" });
```

## 📝 Ejemplo Completo

```tsx
// router.tsx
export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <LazyRoute>
            <HomePage />
          </LazyRoute>
        ),
      },
      {
        path: "catalog",
        element: (
          <LazyRoute>
            <CatalogPage />
          </LazyRoute>
        ),
      },
    ],
  },
]);
```

## 🎨 Loading States

### Skeleton Loaders

Cada ruta tiene su skeleton específico:

- `variant="page"` - Para páginas completas
- `variant="card"` - Para grids de productos
- `variant="detail"` - Para páginas de detalle

## 🔄 Navegación con Estado

### Pasar Datos entre Rutas

```tsx
// Navegar con estado
navigate("/checkout/success", {
  state: { order: orderData }
});

// Leer estado
const location = useLocation();
const order = location.state?.order;
```

## 🛡️ Manejo de Errores

### Error Boundaries en Rutas

El `ErrorBoundary` global captura errores en cualquier ruta.

## 📚 Recursos

- [React Router DOM Docs](https://reactrouter.com/)
- [Lazy Loading Guide](./architecture.md#lazy-loading)
