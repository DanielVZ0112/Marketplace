# Marketplace Backend API

API REST desarrollada con NestJS para el sistema de Marketplace. Permite a los usuarios explorar productos, seleccionarlos y realizar compras de forma sencilla y segura.

## 🚀 Características

- ✅ **Arquitectura Hexagonal** (Clean Architecture) - Separación clara de responsabilidades
- ✅ **Autenticación JWT Opcional** - Sistema de autenticación seguro con tokens (login opcional para compras)
- ✅ **Base de datos PostgreSQL** - Con TypeORM para gestión de entidades
- ✅ **Validación de datos** - Con class-validator y ValidationPipe global
- ✅ **Respuestas estandarizadas** - Formato consistente en todas las respuestas
- ✅ **Soft Delete** - Eliminación lógica de registros
- ✅ **Migraciones y Seeders** - Gestión de esquema y datos iniciales
- ✅ **Sistema de Pagos** - Con simulación de pasarelas de pago para pruebas
- ✅ **Actualización automática de inventario** - Al confirmar pagos exitosos
- ✅ **CORS configurado** - Para integración con frontend
- ✅ **Manejo global de excepciones** - Respuestas de error consistentes

## 📋 Requisitos

- Node.js >= 18
- PostgreSQL >= 14
- npm o yarn

## 🔧 Instalación

```bash
npm install
```

## ⚙️ Configuración

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_password
DB_NAME=marketplace_db
PORT=3000

# JWT Configuration
JWT_SECRET=tu-clave-secreta-super-segura
JWT_EXPIRES_IN=1d

# Frontend Configuration
FRONTEND_URL=http://localhost:5173
```

## 🗄️ Base de Datos

### Ejecutar migraciones

```bash
# Generar migración
npm run migration:generate -- -n NombreMigracion

# Ejecutar migraciones
npm run migration:run

# Revertir última migración
npm run migration:revert
```

### Ejecutar seeders

```bash
npm run seed
```

## 🏃 Ejecución

```bash
# Desarrollo (con hot-reload)
npm run start:dev

# Producción
npm run build
npm run start:prod

# Debug
npm run start:debug
```

## 📚 Documentación

La documentación completa está disponible en la carpeta `docs/`:

- 📖 [Documentación Principal](./docs/README.md) - Índice general
- 🚀 [Guía de Inicio Rápido](./docs/getting-started.md) - Configuración e instalación
- 🏗️ [Arquitectura](./docs/architecture.md) - Arquitectura Hexagonal y estructura
- 📡 [Referencia de API](./docs/api/README.md) - Documentación completa de endpoints
- 🔐 [Autenticación](./docs/authentication.md) - Sistema de autenticación JWT
- 🗄️ [Base de Datos](./docs/database.md) - Migraciones, seeders y esquema
- 🔄 [Flujos de Negocio](./docs/business-flows.md) - Flujos principales del sistema

### Colección de Postman

Importa la colección desde `docs/api/Marketplace-API.postman_collection.json` para probar todos los endpoints.

**Base URL:** `http://localhost:3000/api`

## 🏗️ Estructura del Proyecto

El proyecto sigue **Arquitectura Hexagonal** (Clean Architecture) con separación clara de responsabilidades:

```
src/
├── modules/              # Módulos de dominio
│   ├── auth/            # Autenticación y autorización
│   ├── products/        # Gestión de productos
│   ├── categories/      # Gestión de categorías
│   ├── customers/       # Gestión de clientes
│   ├── users/           # Gestión de usuarios
│   ├── orders/          # Gestión de órdenes
│   ├── product-variants/ # Variantes de productos
│   └── payments/        # Gestión de pagos
│       ├── domain/      # Interfaces y contratos
│       ├── application/ # Casos de uso y DTOs
│       └── infrastructure/ # Implementaciones
├── database/            # Base de datos
│   ├── entities/        # Entidades TypeORM
│   ├── migrations/      # Migraciones
│   └── seeders/         # Datos iniciales
├── common/              # Utilidades compartidas
│   ├── http/           # Respuestas HTTP estandarizadas
│   ├── filters/        # Manejo global de excepciones
│   └── interfaces/     # Interfaces compartidas
├── app.module.ts       # Módulo raíz
└── main.ts             # Punto de entrada
```

Ver documentación detallada en [Arquitectura](./docs/architecture.md)

## 🔐 Autenticación

El sistema utiliza JWT (JSON Web Tokens) para autenticación **opcional**, permitiendo tanto compras con login como Guest Checkout.

**Características:**
- ✅ Login opcional para compras
- ✅ Rutas públicas marcadas con `@Public()`
- ✅ Rutas protegidas requieren token JWT
- ✅ Guard global para protección automática

Ver documentación completa en [Autenticación](./docs/authentication.md)

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📝 Scripts Disponibles

```bash
npm run build              # Compilar proyecto
npm run start             # Iniciar en producción
npm run start:dev         # Iniciar en desarrollo
npm run start:debug       # Iniciar en modo debug
npm run lint              # Ejecutar linter
npm run format            # Formatear código
npm run migration:run      # Ejecutar migraciones
npm run migration:revert   # Revertir migraciones
npm run seed              # Ejecutar seeders
```

## 💳 Sistema de Pagos

El sistema incluye un módulo completo de pagos con simulación para pruebas:

- ✅ Crear y procesar pagos
- ✅ Simulación de éxito/fallo para desarrollo
- ✅ Actualización automática de inventario al confirmar pago
- ✅ Soporte para múltiples métodos de pago

Ver detalles en [Flujos de Negocio](./docs/business-flows.md#-flujo-de-pagos)

## 🛠️ Tecnologías Utilizadas

- **NestJS** - Framework de Node.js
- **TypeORM** - ORM para TypeScript
- **PostgreSQL** - Base de datos relacional
- **JWT** - Autenticación con tokens
- **Passport** - Estrategias de autenticación
- **class-validator** - Validación de DTOs
- **bcrypt** - Hash de contraseñas

## 📄 Licencia

Este proyecto es privado y está desarrollado para evaluación técnica.
