# 🛍️ Marketplace E-commerce

Sistema completo de e-commerce desarrollado como prueba técnica. Permite a los usuarios explorar productos, gestionar un carrito de compras y realizar compras de forma segura, con soporte para autenticación opcional (Guest Checkout).

## 📋 Descripción del Proyecto

Marketplace es una aplicación web full-stack que implementa un sistema de comercio electrónico completo. El proyecto está dividido en dos partes principales:

- **Backend:** API REST desarrollada con NestJS y PostgreSQL
- **Frontend:** Interfaz de usuario desarrollada con React, TypeScript y Vite

### Características Principales

- ✅ **Catálogo de Productos** - Búsqueda, filtros y navegación
- ✅ **Carrito de Compras** - Gestión completa con persistencia
- ✅ **Checkout Completo** - Proceso de pago con Guest Checkout
- ✅ **Autenticación Opcional** - Login opcional para compras
- ✅ **Gestión de Órdenes** - Historial y detalle de pedidos
- ✅ **Sistema de Pagos** - Simulación de pasarelas de pago
- ✅ **Inventario Automático** - Actualización de stock al confirmar pago

## 🏗️ Arquitectura

### Backend
- **Arquitectura:** Hexagonal (Clean Architecture)
- **Framework:** NestJS
- **Base de Datos:** PostgreSQL con TypeORM
- **Autenticación:** JWT (opcional)
- **Validación:** class-validator + class-transformer

### Frontend
- **Arquitectura:** Feature-Based (Modular)
- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **UI Library:** Material-UI
- **Estado:** Zustand + React Query
- **Routing:** React Router DOM con lazy loading

## 📁 Estructura del Proyecto

```
Marketplace/
├── backend/              # API REST (NestJS)
│   ├── src/
│   │   ├── modules/     # Módulos de dominio
│   │   ├── database/    # Entidades, migraciones, seeders
│   │   └── common/       # Utilidades compartidas
│   ├── docs/            # Documentación del backend
│   └── README.md        # Documentación específica
│
├── frontend/             # Interfaz de usuario (React)
│   ├── src/
│   │   ├── modules/     # Módulos de features
│   │   ├── shared/      # Código compartido
│   │   └── app/         # Configuración de app
│   ├── docs/            # Documentación del frontend
│   └── README.md        # Documentación específica
│
├── marketplace-DB.txt    # Backup de base de datos
└── README.md            # Este archivo
```

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js >= 18
- PostgreSQL >= 14
- npm o yarn

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd Marketplace
```

### 2. Configurar Backend

```bash
cd backend
npm install
```

Crear archivo `.env` en `backend/`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_password
DB_NAME=marketplace_db
PORT=3000
JWT_SECRET=tu-clave-secreta-super-segura
JWT_EXPIRES_IN=1d
FRONTEND_URL=http://localhost:5173
```

### 3. Configurar Base de Datos

**Opción A: Usar Backup (Recomendado)**

```bash
# Restaurar backup desde marketplace-DB.txt
psql -U postgres -d marketplace_db -f marketplace-DB.txt
```

**Opción B: Usar Migraciones y Seeders**

```bash
cd backend
npm run migration:run
npm run seed
```

### 4. Iniciar Backend

```bash
cd backend
npm run start:dev
```

El backend estará disponible en `http://localhost:3000/api`

### 5. Configurar Frontend

```bash
cd frontend
npm install
```

Crear archivo `.env.development` en `frontend/`:

```env
VITE_API_URL=http://localhost:3000/api
VITE_URL_IMAGES=/src/assets/product-image
```

### 6. Iniciar Frontend

```bash
cd frontend
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## 📚 Documentación

### Backend

La documentación completa del backend está en `backend/docs/`:

- 📖 [Documentación Principal](./backend/docs/README.md)
- 🏗️ [Arquitectura](./backend/docs/architecture.md)
- 📡 [API Reference](./backend/docs/api/README.md)
- 🔐 [Autenticación](./backend/docs/authentication.md)
- 🗄️ [Base de Datos](./backend/docs/database.md)

### Frontend

La documentación completa del frontend está en `frontend/docs/`:

- 📖 [Documentación Principal](./frontend/docs/README.md)
- 🏗️ [Arquitectura](./frontend/docs/architecture.md)
- 🧩 [Componentes](./frontend/docs/components.md)
- 🎨 [Estilización](./frontend/docs/styling.md)
- 🚦 [Routing](./frontend/docs/routing.md)

## 🗄️ Base de Datos

### Backup

Se incluye un backup de la base de datos en la raíz del proyecto:

- **Archivo:** `marketplace-DB.txt`

**Restaurar backup:**

```bash
psql -U postgres -d marketplace_db -f marketplace-DB.txt
```

**Nota:** Si tienes problemas con los seeders, simplemente restaura el backup y listo.

### Estructura

- **Users** - Usuarios del sistema
- **Customers** - Información de clientes
- **Categories** - Categorías de productos
- **Products** - Productos del catálogo
- **Product Variants** - Variantes (talla, color, stock)
- **Orders** - Órdenes de compra
- **Order Items** - Items de cada orden
- **Payments** - Pagos procesados

## 🔐 Autenticación

El sistema soporta **autenticación opcional**:

- ✅ **Con Login:** Usuario puede ver sus órdenes y tener historial
- ✅ **Sin Login (Guest):** Usuario puede comprar sin registrarse

### Endpoints de Autenticación

- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Obtener perfil (protegido)

## 💳 Flujo de Compra

1. **Explorar Catálogo** - Buscar y filtrar productos
2. **Ver Detalle** - Seleccionar variante (talla, color)
3. **Agregar al Carrito** - Validación de stock
4. **Checkout** - Completar datos de envío
5. **Pago** - Procesar pago (simulado)
6. **Confirmación** - Ver resumen de pedido

## 🛠️ Tecnologías Utilizadas

### Backend
- NestJS 11
- TypeORM
- PostgreSQL
- JWT (Passport)
- class-validator
- bcrypt

### Frontend
- React 19
- TypeScript
- Vite
- React Router DOM v7
- Material-UI v7
- Zustand
- React Query (TanStack Query)
- Axios
- SCSS Modules

## 📊 Características Técnicas

### Backend
- ✅ Arquitectura Hexagonal
- ✅ Validación robusta de datos
- ✅ Rate limiting
- ✅ Manejo global de excepciones
- ✅ Soft Delete
- ✅ Migraciones y Seeders
- ✅ Respuestas estandarizadas

### Frontend
- ✅ Lazy loading de rutas
- ✅ Code splitting automático
- ✅ Error Boundaries
- ✅ Accesibilidad (a11y)
- ✅ Responsive design
- ✅ Optimizaciones de performance
- ✅ Estado global con Zustand
- ✅ Cache inteligente con React Query

## 🧪 Testing

### Backend
```bash
cd backend
npm run test          # Unit tests
npm run test:e2e      # E2E tests
npm run test:cov      # Coverage
```

### Frontend
```bash
cd frontend
npm run test          # Tests (cuando se implementen)
```

**Nota:** Los tests están pendientes de implementación.

## 📝 Scripts Principales

### Backend
```bash
npm run start:dev     # Desarrollo
npm run build         # Build
npm run start:prod    # Producción
npm run migration:run # Ejecutar migraciones
npm run seed          # Ejecutar seeders
```

### Frontend
```bash
npm run dev           # Desarrollo
npm run build         # Build
npm run preview       # Preview de build
```

## 🔧 Configuración de Entorno

### Backend (.env)
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_password
DB_NAME=marketplace_db
PORT=3000
JWT_SECRET=tu-clave-secreta
JWT_EXPIRES_IN=1d
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env.development)
```env
VITE_API_URL=http://localhost:3000/api
VITE_URL_IMAGES=/src/assets/product-image
```

## 🐛 Troubleshooting

### Backend no inicia

1. Verifica que PostgreSQL esté corriendo
2. Verifica las credenciales en `.env`
3. Verifica que la base de datos exista

### Frontend no conecta con Backend

1. Verifica que el backend esté corriendo en `http://localhost:3000`
2. Verifica `VITE_API_URL` en `.env.development`
3. Verifica CORS en backend

### Imágenes no cargan

1. Verifica que las imágenes existan en `frontend/src/assets/product-image/`
2. Verifica `VITE_URL_IMAGES` en `.env.development`
3. Verifica que los productos tengan `image_url` en la base de datos

### Problemas con Base de Datos

**Solución rápida:** Restaura el backup `marketplace-DB.txt`

```bash
psql -U postgres -d marketplace_db -f marketplace-DB.txt
```

## 📦 Estructura de Módulos

### Backend Modules
- `auth` - Autenticación JWT
- `users` - Gestión de usuarios
- `customers` - Gestión de clientes
- `categories` - Categorías de productos
- `products` - Productos del catálogo
- `product-variants` - Variantes de productos
- `orders` - Órdenes de compra
- `payments` - Procesamiento de pagos

### Frontend Modules
- `auth` - Autenticación y login
- `catalog` - Catálogo y búsqueda
- `cart` - Carrito de compras
- `checkout` - Proceso de pago
- `orders` - Gestión de órdenes
- `layout` - Layout y navegación

## 🎯 Próximos Pasos

### Para Desarrollo

1. Implementar tests (unitarios y E2E)
2. Agregar logging estructurado
3. Implementar monitoreo (APM)
4. Optimizar queries adicionales

### Para Producción

1. Configurar CI/CD
2. Setup de staging environment
3. Implementar CDN para imágenes
4. Configurar monitoring y alertas

## 📄 Licencia

Este proyecto es privado y está desarrollado para evaluación técnica.

## 👤 Autor
Daniel Felipe Vasco Zapata.
Desarrollado como prueba técnica - Enero 2026.

---

**Nota:** Este proyecto fue entregado en 8 días (plazo original: 10 días), demostrando eficiencia y capacidad de gestión de tiempo.
