# 📚 Documentación Frontend - Marketplace

Bienvenido a la documentación completa del frontend del Marketplace. Esta documentación cubre arquitectura, componentes, estilización y todas las implementaciones relevantes del proyecto.

## 📑 Índice

1. [Arquitectura](./architecture.md) - Estructura del proyecto y organización del código
2. [Componentes](./components.md) - Componentes reutilizables y su uso
3. [Estilización](./styling.md) - Sistema de diseño, tokens y metodología SCSS
4. [Routing](./routing.md) - Sistema de rutas y lazy loading
5. [Estado Global](./state-management.md) - Zustand stores y gestión de estado
6. [Data Fetching](./data-fetching.md) - React Query y manejo de datos
7. [Implementaciones](./implementations.md) - Features implementadas y patrones

## 🚀 Inicio Rápido

### Instalación

```bash
npm install
```

### Configuración

Crea un archivo `.env.development` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:3000/api
VITE_URL_IMAGES=/src/assets/product-image
```

### Desarrollo

```bash
npm run dev
```

### Build

```bash
npm run build
```

## 🏗️ Estructura General

```
src/
├── app/                    # Configuración de la aplicación
│   ├── providers.tsx      # Proveedores globales (React Query, Theme, ErrorBoundary)
│   └── router.tsx         # Configuración de rutas con lazy loading
├── modules/                # Módulos de dominio (Feature-based)
│   ├── auth/              # Autenticación
│   ├── catalog/           # Catálogo de productos
│   ├── cart/              # Carrito de compras
│   ├── checkout/          # Proceso de pago
│   ├── layout/            # Layout y navegación
│   └── orders/            # Gestión de órdenes
└── shared/                # Código compartido
    ├── components/        # Componentes reutilizables
    ├── hooks/            # Hooks personalizados
    ├── lib/              # Utilidades y configuraciones
    ├── stores/           # Zustand stores
    ├── styles/           # Estilos globales y tokens
    ├── types/            # Tipos TypeScript compartidos
    └── ui/               # Componentes UI base
```

## 🛠️ Tecnologías Principales

- **React 19** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **React Router DOM** - Routing
- **Material-UI (MUI)** - Componentes UI
- **Zustand** - Estado global
- **React Query** - Data fetching y cache
- **SCSS Modules** - Estilos modulares
- **Axios** - Cliente HTTP

## 📖 Guías

- [Arquitectura](./architecture.md) - Entiende la estructura del proyecto
- [Componentes](./components.md) - Aprende a usar los componentes
- [Estilización](./styling.md) - Sistema de diseño y estilos
- [Routing](./routing.md) - Cómo funciona el sistema de rutas
- [Estado Global](./state-management.md) - Gestión de estado con Zustand
- [Data Fetching](./data-fetching.md) - React Query y API calls
- [Implementaciones](./implementations.md) - Features y patrones implementados
