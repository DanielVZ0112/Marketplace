# 🛍️ Marketplace Frontend

Frontend del sistema de Marketplace desarrollado con React, TypeScript y Vite. Interfaz moderna y responsive para explorar productos, gestionar carrito y realizar compras.

## 🚀 Características

- ✅ **Arquitectura Modular** - Organización por features (Feature-Based)
- ✅ **TypeScript** - Tipado estático completo
- ✅ **React Router DOM** - Routing con lazy loading
- ✅ **Material-UI** - Componentes UI modernos
- ✅ **Zustand** - Estado global ligero
- ✅ **React Query** - Data fetching y cache inteligente
- ✅ **SCSS Modules** - Estilos modulares y scoped
- ✅ **Lazy Loading** - Carga diferida de rutas (5x más rápido)
- ✅ **Error Boundaries** - Manejo robusto de errores
- ✅ **Accesibilidad** - ARIA labels y navegación por teclado

## 📋 Requisitos

- Node.js >= 18
- npm o yarn

## 🔧 Instalación

```bash
npm install
```

## ⚙️ Configuración

Crea un archivo `.env.development` en la raíz del proyecto:

```env
# URL del API Backend
VITE_API_URL=http://localhost:3000/api

# Ruta base para imágenes de productos
VITE_URL_IMAGES=/src/assets/product-image
```

**Nota:** Asegúrate de que el backend esté corriendo en `http://localhost:3000/api` antes de iniciar el frontend.

## 🏃 Ejecución

### Desarrollo

```bash
npm run dev
```

El servidor de desarrollo se iniciará en `http://localhost:5173`

### Build para Producción

```bash
npm run build
```

Los archivos compilados se generarán en la carpeta `dist/`

### Preview de Producción

```bash
npm run preview
```

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Configuración de aplicación
│   ├── providers.tsx      # Proveedores globales (React Query, Theme, ErrorBoundary)
│   └── router.tsx         # Configuración de rutas con lazy loading
│
├── modules/                # Módulos de dominio (Feature-based)
│   ├── auth/              # Autenticación y login
│   ├── catalog/           # Catálogo de productos
│   ├── cart/              # Carrito de compras
│   ├── checkout/          # Proceso de pago
│   ├── layout/            # Layout y navegación
│   └── orders/            # Gestión de órdenes
│
└── shared/                 # Código compartido
    ├── components/        # Componentes reutilizables
    ├── hooks/             # Hooks personalizados
    ├── lib/               # Utilidades (axios, react-query, theme)
    ├── stores/            # Zustand stores (cart, session, filters)
    ├── styles/            # Estilos globales y tokens de diseño
    ├── types/             # Tipos TypeScript compartidos
    └── ui/                # Componentes UI base
```

## 🗺️ Rutas

- `/` - Página de inicio (HomePage)
- `/catalog` - Catálogo de productos con filtros
- `/catalog/:id` - Detalle de producto
- `/checkout` - Proceso de pago
- `/checkout/success` - Confirmación de pedido
- `/login` - Inicio de sesión
- `/orders` - Mis órdenes (requiere autenticación)
- `/orders/:id` - Detalle de orden (requiere autenticación)

## 🎨 Sistema de Diseño

### Tokens de Diseño

Los tokens están definidos en `shared/styles/_tokens.scss`:

- **Colores:** Base, acento, estados (error, success, warning)
- **Espaciado:** xs (4px) a 3xl (64px)
- **Border Radius:** sm, md, lg
- **Sombras:** sm, md, lg, xl
- **Transiciones:** fast (150ms), base (200ms), slow (300ms)
- **Breakpoints:** sm (640px), md (768px), lg (1024px), xl (1280px)

### SCSS Modules

Cada componente tiene su archivo `.module.scss`:

```tsx
import styles from "./component.module.scss";

<div className={styles.container}>
```

## 🔄 Estado Global

### Zustand Stores

- **cart.store.ts** - Estado del carrito (persistido en localStorage)
- **session.store.ts** - Estado de sesión (usuario, token)
- **filters.store.ts** - Filtros del catálogo (sincronizado con URL)

### Uso

```tsx
const items = useCartStore((s) => s.items);
const addItem = useCartStore((s) => s.addItem);
```

## 📡 Data Fetching

### React Query

Todas las llamadas al API usan React Query:

```tsx
const { data, isLoading } = useGetProducts();
```

### Repositories

Cada módulo tiene un Repository para llamadas API:

```typescript
CatalogApiRepository.getProducts(filters)
```

## 🎯 Features Principales

### Catálogo

- ✅ Búsqueda de productos
- ✅ Filtros (categoría, talla, color, precio)
- ✅ Ordenamiento
- ✅ Paginación
- ✅ Vista de detalle

### Carrito

- ✅ Agregar/remover productos
- ✅ Modificar cantidades
- ✅ Validación de stock
- ✅ Persistencia en localStorage

### Checkout

- ✅ Formulario de datos de envío
- ✅ Opción de registro durante checkout
- ✅ Proceso de pago simulado
- ✅ Confirmación de pedido

### Autenticación

- ✅ Login con JWT
- ✅ Registro de usuarios
- ✅ Sesión persistente
- ✅ Guest checkout (sin login)

## ⚡ Optimizaciones

### Performance

- ✅ **Lazy Loading** - Rutas cargadas bajo demanda
- ✅ **Code Splitting** - Chunks separados por ruta
- ✅ **React.memo** - Componentes memoizados
- ✅ **Image Lazy Loading** - Carga diferida de imágenes

### Resultados

- **Carga inicial:** 5x más rápida (1MB → 200KB)
- **Tiempo de carga:** 6-10x más rápido (3-5s → 0.5-1s)

## ♿ Accesibilidad

- ✅ ARIA labels en elementos interactivos
- ✅ Navegación completa por teclado
- ✅ Elementos semánticos HTML
- ✅ Alt text en imágenes
- ✅ Focus visible

## 🛡️ Manejo de Errores

- ✅ Error Boundaries para errores de renderizado
- ✅ Empty states cuando no hay datos
- ✅ Loading states durante carga
- ✅ Mensajes de error amigables

## 📚 Documentación

La documentación completa está disponible en `docs/`:

- 📖 [Índice de Documentación](./docs/README.md)
- 🏗️ [Arquitectura](./docs/architecture.md)
- 🧩 [Componentes](./docs/components.md)
- 🎨 [Estilización](./docs/styling.md)
- 🚦 [Routing](./docs/routing.md)
- 🔄 [Estado Global](./docs/state-management.md)
- 📡 [Data Fetching](./docs/data-fetching.md)
- 🚀 [Implementaciones](./docs/implementations.md)

## 🛠️ Tecnologías

- **React 19** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool
- **React Router DOM v7** - Routing
- **Material-UI v7** - Componentes UI
- **Zustand** - Estado global
- **React Query** - Data fetching
- **Axios** - Cliente HTTP
- **SCSS Modules** - Estilos modulares

## 📝 Scripts Disponibles

```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build para producción
npm run preview    # Preview de build de producción
npm run lint       # Ejecutar linter
```

## 🔗 Integración con Backend

El frontend se comunica con el backend a través de:

- **Base URL:** Configurada en `VITE_API_URL` (default: `http://localhost:3000/api`)
- **Autenticación:** JWT tokens en headers
- **CORS:** Configurado en backend

## 🐛 Troubleshooting

### Imágenes no cargan

Verifica que:
1. Las imágenes existan en `src/assets/product-image/`
2. El nombre coincida con el `image_url` del producto
3. `VITE_URL_IMAGES` esté configurado correctamente

### Errores de CORS

Asegúrate de que:
1. El backend esté corriendo
2. `FRONTEND_URL` en backend apunte a `http://localhost:5173`
3. CORS esté habilitado en backend

### Estado no persiste

Verifica:
1. localStorage habilitado en el navegador
2. No hay errores en consola
3. Zustand persist middleware configurado

## 📄 Licencia

Este proyecto es privado y está desarrollado para evaluación técnica.
