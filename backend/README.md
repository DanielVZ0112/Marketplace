# 🚀 Marketplace Backend API

API REST desarrollada con NestJS y PostgreSQL para el sistema de Marketplace. Proporciona endpoints para gestión de productos, autenticación, carrito de compras, checkout y procesamiento de pagos.

## 🚀 Características

- ✅ **Arquitectura Hexagonal** (Clean Architecture) - Separación clara de responsabilidades
- ✅ **Autenticación JWT Opcional** - Sistema de autenticación seguro con tokens (login opcional para compras)
- ✅ **Base de datos PostgreSQL** - Con TypeORM para gestión de entidades
- ✅ **Validación Robusta** - class-validator + class-transformer con sanitización
- ✅ **Rate Limiting** - Protección contra abuso (100 req/min global, 5 req/min en login)
- ✅ **Respuestas Estandarizadas** - Formato consistente en todas las respuestas
- ✅ **Soft Delete** - Eliminación lógica de registros
- ✅ **Migraciones y Seeders** - Gestión de esquema y datos iniciales
- ✅ **Sistema de Pagos** - Con simulación de pasarelas de pago para pruebas
- ✅ **Actualización Automática de Inventario** - Al confirmar pagos exitosos
- ✅ **CORS Configurado** - Para integración con frontend
- ✅ **Manejo Global de Excepciones** - Respuestas de error consistentes
- ✅ **Queries Optimizadas** - Uso de relations para evitar N+1

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

### Opción 1: Restaurar Backup (Recomendado)

Si tienes problemas con los seeders, simplemente restaura el backup:

```bash
# Desde la raíz del proyecto
psql -U postgres -d marketplace_db -f marketplace-DB.txt
```

**Nota:** El backup `marketplace-DB.txt` está en la raíz del proyecto.

### Opción 2: Usar Migraciones y Seeders

#### Ejecutar migraciones

```bash
# Generar migración
npm run migration:generate -- -n NombreMigracion

# Ejecutar migraciones
npm run migration:run

# Revertir última migración
npm run migration:revert

# Ver estado de migraciones
npm run migration:show
```

#### Ejecutar seeders

```bash
npm run seed
```

**Nota:** Los seeders crean datos iniciales (usuarios, categorías, productos, variantes).

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

- **NestJS 11** - Framework de Node.js
- **TypeORM 0.3** - ORM para TypeScript
- **PostgreSQL 14+** - Base de datos relacional
- **JWT (Passport)** - Autenticación con tokens
- **class-validator** - Validación de DTOs
- **class-transformer** - Transformación y sanitización
- **@nestjs/throttler** - Rate limiting
- **bcrypt** - Hash de contraseñas

## 🔒 Seguridad

### Rate Limiting

- **Global:** 100 requests por minuto
- **Login:** 5 requests por minuto (protección contra fuerza bruta)

### Validación

- Validación estricta de todos los inputs
- Sanitización automática (trim, lowercase)
- Validación de formatos (email, teléfono, etc.)

### Autenticación

- JWT tokens con expiración configurable
- Passwords hasheados con bcrypt
- Rutas protegidas con guards

## 📊 Performance

### Optimizaciones

- ✅ Uso de `relations` en TypeORM (evita queries N+1)
- ✅ Índices en campos de búsqueda frecuente
- ✅ Soft delete para mantener integridad referencial
- ✅ Paginación en endpoints de listado

## 📄 Licencia

Este proyecto es privado y está desarrollado para evaluación técnica.

---

**Nota:** Para más detalles sobre la arquitectura y endpoints, consulta la documentación en `docs/`.
