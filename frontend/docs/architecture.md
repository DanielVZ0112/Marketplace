# 🏗️ Arquitectura Frontend

## Visión General

El frontend del Marketplace sigue una **arquitectura modular basada en features** (Feature-Based Architecture) con separación clara de responsabilidades y código compartido centralizado.

## 📁 Estructura del Proyecto

```
src/
├── app/                          # Configuración de aplicación
│   ├── providers.tsx            # Proveedores globales
│   └── router.tsx               # Configuración de rutas
│
├── modules/                      # Módulos de dominio (Features)
│   ├── auth/                    # Módulo de autenticación
│   │   ├── application/        # Casos de uso (hooks)
│   │   ├── domain/              # Entidades y tipos
│   │   ├── infrastructure/      # Repositorios API
│   │   └── ui/                   # Componentes UI
│   │
│   ├── catalog/                  # Módulo de catálogo
│   │   ├── application/         # useGetProducts, useGetProduct, etc.
│   │   ├── domain/              # Product, Category, ProductVariant
│   │   ├── infrastructure/      # CatalogApiRepository, imageUrlHelper
│   │   └── ui/                   # Pages y Components
│   │
│   ├── cart/                     # Módulo de carrito
│   ├── checkout/                 # Módulo de checkout
│   ├── layout/                   # Layout y navegación
│   └── orders/                   # Módulo de órdenes
│
└── shared/                        # Código compartido
    ├── components/               # Componentes reutilizables
    ├── hooks/                    # Hooks personalizados
    ├── lib/                      # Utilidades (axios, react-query, theme)
    ├── stores/                   # Zustand stores globales
    ├── styles/                   # Estilos globales y tokens
    ├── types/                    # Tipos TypeScript compartidos
    └── ui/                       # Componentes UI base
```

## 🎯 Principios Arquitectónicos

### 1. Feature-Based Organization

Cada feature (auth, catalog, checkout) es un módulo independiente con su propia estructura:

```
module/
├── application/    # Lógica de negocio (hooks, casos de uso)
├── domain/         # Entidades y tipos del dominio
├── infrastructure/ # Implementaciones técnicas (API, helpers)
└── ui/             # Componentes de presentación
```

**Ventajas:**
- ✅ Código relacionado está junto
- ✅ Fácil de encontrar y mantener
- ✅ Escalable - agregar features es simple
- ✅ Independiente - cada módulo puede evolucionar solo

### 2. Separación de Responsabilidades

#### Application Layer
- Contiene la lógica de negocio
- Hooks personalizados (useGetProducts, useLogin)
- Orquestación de datos

#### Domain Layer
- Entidades y tipos TypeScript
- Interfaces y contratos
- Lógica de dominio pura

#### Infrastructure Layer
- Implementaciones técnicas
- Llamadas a API
- Helpers y utilidades

#### UI Layer
- Componentes de presentación
- Páginas
- Estilos (SCSS modules)

### 3. Shared Code

El código compartido vive en `shared/`:
- **components/** - Componentes reutilizables (BackButton, ErrorBoundary)
- **stores/** - Estado global (cart, session, filters)
- **lib/** - Configuraciones (axios, react-query, theme)
- **styles/** - Tokens de diseño y estilos globales

## 🔄 Flujo de Datos

```
UI Component
    ↓
Application Hook (useGetProducts)
    ↓
Infrastructure (CatalogApiRepository)
    ↓
API Backend
    ↓
React Query Cache
    ↓
UI Component (actualizado)
```

### Ejemplo Real

```tsx
// UI Layer
<ProductCard product={product} />

// Application Layer
const { data } = useGetProducts(); // Hook personalizado

// Infrastructure Layer
CatalogApiRepository.getProducts() // Llamada API

// Domain Layer
interface Product { ... } // Tipo TypeScript
```

## 📦 Módulos Principales

### Auth Module
**Responsabilidad:** Autenticación y autorización

```
auth/
├── application/
│   ├── useLogin.ts
│   ├── useLogout.ts
│   ├── useCreateUser.ts
│   └── useProfile.ts
├── domain/
│   ├── User.ts
│   ├── LoginDto.ts
│   └── CreateUserDto.ts
├── infrastructure/
│   └── AuthApiRepository.ts
└── ui/
    └── pages/
        └── LoginPage.tsx
```

### Catalog Module
**Responsabilidad:** Catálogo de productos, búsqueda y filtros

```
catalog/
├── application/
│   ├── useGetProducts.ts
│   ├── useGetProduct.ts
│   └── useGetCategories.ts
├── domain/
│   ├── Product.ts
│   ├── Category.ts
│   ├── ProductVariant.ts
│   └── ProductFilters.ts
├── infrastructure/
│   ├── CatalogApiRepository.ts
│   └── imageUrlHelper.ts
└── ui/
    ├── pages/
    │   ├── HomePage.tsx
    │   ├── CatalogPage.tsx
    │   └── ProductDetailPage.tsx
    └── components/
        ├── ProductCard.tsx
        ├── ProductGrid.tsx
        ├── FiltersSidebar.tsx
        └── ...
```

### Cart Module
**Responsabilidad:** Gestión del carrito de compras

```
cart/
├── application/
│   └── useCart.ts
├── domain/
│   └── CartItem.ts
└── ui/
    └── pages/
        └── CartPage.tsx
```

**Nota:** El estado del carrito está en `shared/stores/cart.store.ts` (Zustand)

### Checkout Module
**Responsabilidad:** Proceso de pago y checkout

```
checkout/
├── application/
│   ├── useCheckout.ts
│   ├── useCreateCustomer.ts
│   ├── useCreateOrder.ts
│   └── useProcessPayment.ts
├── domain/
│   ├── Customer.ts
│   ├── Order.ts
│   └── CreatePayment.ts
├── infrastructure/
│   └── CheckoutApiRepository.ts
└── ui/
    ├── pages/
    │   ├── CheckoutPage.tsx
    │   └── CheckoutSuccessPage.tsx
```

## 🔌 Integración con Backend

### Configuración

**Archivo:** `frontend/.env.development`

```env
VITE_API_URL=http://localhost:3000/api
VITE_URL_IMAGES=/src/assets/product-image
```

### Cliente HTTP

**Archivo:** `shared/lib/axios.ts`

- Configuración base de Axios
- Interceptores para tokens JWT
- Manejo de errores global

### Uso

```typescript
// En un Repository
import { apiClient } from '@/shared/lib/axios';

export class CatalogApiRepository {
  static async getProducts(filters?: any) {
    const response = await apiClient.get('/products', { params: filters });
    return response.data;
  }
}
```

## 🎨 Sistema de Estilos

### Tokens de Diseño

**Archivo:** `shared/styles/_tokens.scss`

- Colores (base, acento, estados)
- Espaciado (xs, sm, md, lg, xl, 2xl, 3xl)
- Border radius
- Sombras
- Transiciones
- Breakpoints

### SCSS Modules

Cada componente tiene su archivo `.module.scss`:

```scss
// product-card.module.scss
.productCard {
  // Estilos específicos del componente
}
```

### Estilos Globales

**Archivo:** `shared/styles/main.scss`

- Estilos globales de Material-UI
- Reset y normalización
- Utilidades compartidas

## 🔄 Estado Global

### Zustand Stores

**Ubicación:** `shared/stores/`

1. **cart.store.ts** - Estado del carrito
2. **session.store.ts** - Estado de sesión (usuario, token)
3. **filters.store.ts** - Filtros del catálogo

### Características

- ✅ Persistencia en localStorage
- ✅ TypeScript tipado
- ✅ Selectores optimizados
- ✅ Sincronización con URL

## 📡 Data Fetching

### React Query

**Configuración:** `shared/lib/react-query.ts`

- Cache automático
- Refetch automático
- Optimistic updates
- Error handling

### Query Keys

**Archivo:** `shared/lib/query-keys.ts`

- Organización centralizada de keys
- Invalidation patterns

## 🚦 Routing

### Lazy Loading

Todas las rutas usan lazy loading para mejor performance:

```tsx
const HomePage = lazy(() => import("@/modules/catalog/ui/pages/HomePage"));
```

### Estructura de Rutas

```
/                    → HomePage
/catalog             → CatalogPage
/catalog/:id         → ProductDetailPage
/checkout            → CheckoutPage
/checkout/success    → CheckoutSuccessPage
/login               → LoginPage
/orders              → MyOrdersPage
/orders/:id          → OrderDetailPage
```

## 🛡️ Manejo de Errores

### Error Boundaries

**Componente:** `shared/components/ErrorBoundary.tsx`

- Captura errores de renderizado
- UI amigable de error
- Opciones de recuperación

### Integración

```tsx
<ErrorBoundary>
  <AppProviders>
    <RouterProvider router={router} />
  </AppProviders>
</ErrorBoundary>
```

## ♿ Accesibilidad

### Implementaciones

- ✅ ARIA labels en elementos interactivos
- ✅ Navegación por teclado (Tab, Enter, Espacio)
- ✅ Elementos semánticos HTML
- ✅ Alt text en imágenes
- ✅ Focus visible

## ⚡ Performance

### Optimizaciones Implementadas

1. **Lazy Loading** - Rutas cargadas bajo demanda
2. **Code Splitting** - Chunks separados por ruta
3. **React.memo** - Componentes memoizados
4. **React Query** - Cache inteligente
5. **Image Lazy Loading** - `loading="lazy"` en imágenes

## 📝 Convenciones

### Naming

- **Componentes:** PascalCase (`ProductCard.tsx`)
- **Hooks:** camelCase con `use` (`useGetProducts.ts`)
- **Stores:** camelCase con `store` (`cart.store.ts`)
- **Estilos:** kebab-case (`product-card.module.scss`)

### Imports

- Usar path aliases (`@/modules/...`)
- Agrupar imports (React, librerías, locales)
- Orden: externos → internos

### Estructura de Componentes

```tsx
// 1. Imports
import ... from '...';

// 2. Types/Interfaces
interface Props { ... }

// 3. Component
export function Component({ prop }: Props) {
  // 4. Hooks
  const hook = useHook();
  
  // 5. Handlers
  const handleClick = () => { ... };
  
  // 6. Render
  return <div>...</div>;
}
```

## 🔗 Dependencias entre Capas

```
UI → Application → Infrastructure → API
     ↓
   Domain (tipos compartidos)
```

**Regla:** Las capas solo pueden importar de capas inferiores o del mismo nivel.

## 📚 Recursos Adicionales

- [Componentes](./components.md) - Detalles de componentes
- [Estilización](./styling.md) - Sistema de diseño
- [Routing](./routing.md) - Sistema de rutas
- [Estado Global](./state-management.md) - Zustand stores
- [Data Fetching](./data-fetching.md) - React Query
