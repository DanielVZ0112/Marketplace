# 🧩 Componentes Frontend

## Componentes por Módulo

### 📦 Catalog Module

#### ProductCard
**Ubicación:** `modules/catalog/ui/components/ProductCard.tsx`

**Descripción:** Tarjeta de producto para mostrar en grids y listas.

**Props:**
```typescript
interface Props {
  product: Product;
}
```

**Características:**
- ✅ Memoizado con `React.memo` para performance
- ✅ Navegación por teclado (Enter, Espacio)
- ✅ ARIA labels para accesibilidad
- ✅ Lazy loading de imágenes
- ✅ Manejo de errores de imagen

**Uso:**
```tsx
<ProductCard product={product} />
```

#### ProductGrid
**Ubicación:** `modules/catalog/ui/components/ProductGrid.tsx`

**Descripción:** Grid responsivo para mostrar productos.

**Props:**
```typescript
interface Props {
  products: Product[];
}
```

**Características:**
- Grid responsivo (1-4 columnas según breakpoint)
- Gap consistente

#### FiltersSidebar
**Ubicación:** `modules/catalog/ui/components/FiltersSidebar.tsx`

**Descripción:** Sidebar con filtros de búsqueda (categoría, talla, color, precio).

**Características:**
- Filtros sincronizados con URL
- Estado persistente
- Clear filters

#### VariantSelector
**Ubicación:** `modules/catalog/ui/components/VariantSelector.tsx`

**Descripción:** Selector de variantes (talla, color) para productos.

**Props:**
```typescript
interface Props {
  variants: ProductVariant[];
  selectedVariant?: ProductVariant;
  onChange: (variant: ProductVariant) => void;
}
```

#### SearchBar
**Ubicación:** `modules/catalog/ui/components/SearchBar.tsx`

**Descripción:** Barra de búsqueda con debounce.

**Características:**
- Debounce de 300ms
- Sincronización con URL

---

### 🛒 Cart Module

#### CartDrawer
**Ubicación:** `modules/layout/ui/components/CartDrawer.tsx`

**Descripción:** Drawer lateral para mostrar el carrito.

**Características:**
- Abre/cierra desde navbar
- Muestra items, totales
- Botones para modificar cantidad
- Botón para ir a checkout

---

### 🎨 Layout Module

#### Navbar
**Ubicación:** `modules/layout/ui/components/Navbar.tsx`

**Descripción:** Barra de navegación principal.

**Características:**
- Logo con animación hover
- Menú de usuario (si está autenticado)
- Botón de carrito con badge
- Navegación por teclado
- ARIA labels

#### Footer
**Ubicación:** `modules/layout/ui/components/Footer.tsx`

**Descripción:** Pie de página con información.

---

### 🔐 Auth Module

#### LoginPage
**Ubicación:** `modules/auth/ui/pages/LoginPage.tsx`

**Descripción:** Página de inicio de sesión.

**Características:**
- Formulario validado
- Manejo de errores
- Botón con animación palpitante
- Tema oscuro en botón

---

### 💳 Checkout Module

#### CheckoutPage
**Ubicación:** `modules/checkout/ui/pages/CheckoutPage.tsx`

**Descripción:** Página de checkout con formulario de cliente.

**Características:**
- Formulario de datos de envío
- Opción de registro durante checkout
- Validación de contraseñas
- Resumen de pedido
- Integración con carrito

#### CheckoutSuccessPage
**Ubicación:** `modules/checkout/ui/pages/CheckoutSuccessPage.tsx`

**Descripción:** Página de confirmación de pedido exitoso.

**Características:**
- Muestra información del pedido
- Información del cliente
- Lista de items comprados
- Total y estado

---

## 🧩 Componentes Compartidos

### ErrorBoundary
**Ubicación:** `shared/components/ErrorBoundary.tsx`

**Descripción:** Componente para capturar errores de renderizado.

**Características:**
- Captura errores en el árbol de componentes
- UI amigable de error
- Botones de recuperación
- Debug info en desarrollo

**Uso:**
```tsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### BackButton
**Ubicación:** `shared/components/BackButton.tsx`

**Descripción:** Botón para volver atrás.

**Props:**
```typescript
interface Props {
  to: string;
  label?: string;
}
```

### GoHomeButton
**Ubicación:** `shared/components/GoHomeButton.tsx`

**Descripción:** Botón para ir al inicio.

**Props:**
```typescript
interface Props {
  label?: string;
  showIcon?: boolean;
}
```

### NavigationButton
**Ubicación:** `shared/components/NavigationButton.tsx`

**Descripción:** Botón de navegación genérico.

---

## 🎨 Componentes UI Base

### SkeletonLoader
**Ubicación:** `shared/ui/components/SkeletonLoader.tsx`

**Descripción:** Skeleton loader para estados de carga.

**Props:**
```typescript
interface Props {
  count?: number;        // Número de skeletons
  variant?: 'card' | 'list' | 'detail' | 'page';
}
```

**Variantes:**
- `card` - Para grids de productos
- `list` - Para listas
- `detail` - Para páginas de detalle
- `page` - Para páginas completas

### EmptyState
**Ubicación:** `shared/ui/components/EmptyState.tsx`

**Descripción:** Estado vacío cuando no hay datos.

**Props:**
```typescript
interface Props {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

### Loader
**Ubicación:** `shared/ui/components/Loader.tsx`

**Descripción:** Spinner de carga.

---

## 📋 Páginas Principales

### HomePage
**Ubicación:** `modules/catalog/ui/pages/HomePage.tsx`

**Secciones:**
1. Hero Section - Imagen principal con CTA
2. Categories Section - Navegación por categorías
3. Featured Products - Productos destacados
4. Promo Banner - Banner promocional
5. Features Section - Características del servicio

### CatalogPage
**Ubicación:** `modules/catalog/ui/pages/CatalogPage.tsx`

**Características:**
- Grid de productos
- Sidebar de filtros
- Paginación
- Sincronización con URL
- Loading states

### ProductDetailPage
**Ubicación:** `modules/catalog/ui/pages/ProductDetailPage.tsx`

**Características:**
- Imagen del producto
- Información detallada
- Selector de variantes
- Agregar al carrito
- Validación de stock

---

## 🎯 Patrones de Componentes

### Componentes Presentacionales

Componentes que solo muestran datos, sin lógica de negocio:

```tsx
function ProductCard({ product }: { product: Product }) {
  // Solo presentación
  return <div>{product.name}</div>;
}
```

### Componentes con Hooks

Componentes que usan hooks para obtener datos:

```tsx
function CatalogPage() {
  const { data, isLoading } = useGetProducts();
  // Lógica y presentación
  return <div>...</div>;
}
```

### Componentes Contenedores

Componentes que orquestan otros componentes:

```tsx
function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
```

---

## 🔄 Reutilización

### Componentes Reutilizables

Ubicados en `shared/components/`:
- ✅ ErrorBoundary
- ✅ BackButton
- ✅ GoHomeButton
- ✅ NavigationButton

### Componentes Específicos

Ubicados en `modules/*/ui/components/`:
- Específicos de cada feature
- No se reutilizan entre módulos

---

## 📝 Convenciones

### Props

- Usar interfaces TypeScript
- Props opcionales con `?`
- Props con valores por defecto cuando sea apropiado

### Naming

- Componentes: PascalCase
- Props: camelCase
- Event handlers: `handle*` (handleClick, handleSubmit)

### Estilos

- SCSS Modules para estilos específicos
- BEM naming en clases
- Tokens de diseño para valores

---

## 🎨 Estilos de Componentes

Cada componente tiene su archivo `.module.scss`:

```scss
// product-card.module.scss
.productCard {
  &__imageWrapper { ... }
  &__content { ... }
  &__title { ... }
  &__price { ... }
}
```

**Ventajas:**
- ✅ Scoped styles (no conflictos)
- ✅ TypeScript support
- ✅ Tree-shaking
- ✅ BEM naming automático
