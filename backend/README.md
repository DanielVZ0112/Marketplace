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

## 📚 Documentación API

Importa la colección de Postman desde `docs/api/Marketplace-API.postman_collection.json`

**Base URL:** `http://localhost:3000/api`

### Endpoints principales:

- **Auth**: `/api/auth/login`, `/api/auth/profile`
- **Products**: `/api/products` (CRUD completo)
- **Categories**: `/api/categories` (CRUD completo)
- **Customers**: `/api/customers` (CRUD completo)
- **Users**: `/api/users` (CRUD completo)
- **Orders**: `/api/orders` (CRUD completo)
- **Product Variants**: `/api/product-variants` (CRUD completo)
- **Payments**: `/api/payments` (Crear, procesar, listar pagos)

### Flujo de Compra

El sistema soporta **compra sin login (Guest Checkout)** y **compra con login**:

1. **Sin Login**: `POST /api/customers` → `POST /api/orders` → `POST /api/payments` → `POST /api/payments/process`
2. **Con Login**: Login opcional para recuperar datos automáticamente y ver historial

Ver documentación completa en `FLUJO_AUTENTICACION_OPCIONAL.md`

## 🏗️ Estructura del Proyecto

```
src/
├── modules/              # Módulos de dominio (Clean Architecture)
│   ├── auth/            # Autenticación y autorización
│   ├── products/        # Gestión de productos
│   ├── categories/      # Gestión de categorías
│   ├── customers/       # Gestión de clientes
│   ├── users/           # Gestión de usuarios
│   ├── orders/          # Gestión de órdenes
│   ├── product-variants/ # Variantes de productos
│   └── payments/        # Gestión de pagos y procesamiento
│       ├── domain/      # Interfaces y contratos
│       ├── application/ # Casos de uso y DTOs
│       └── infrastructure/ # Implementaciones (repositorios)
├── database/            # Base de datos
│   ├── entities/        # Entidades TypeORM
│   ├── migrations/      # Migraciones de base de datos
│   └── seeders/         # Datos iniciales
├── common/              # Utilidades compartidas
│   ├── enums/          # Enumeraciones compartidas
│   ├── filters/        # Filtros globales (excepciones)
│   ├── http/           # Clases de respuesta HTTP
│   └── interfaces/     # Interfaces compartidas
├── app.module.ts       # Módulo raíz
└── main.ts             # Punto de entrada
```

## 🔐 Autenticación

El sistema utiliza JWT (JSON Web Tokens) para autenticación **opcional**:

1. **Login**: `POST /api/auth/login` - Obtiene un token JWT
2. **Rutas protegidas**: Incluir header `Authorization: Bearer <token>`
3. **Rutas públicas**: Marcadas con el decorador `@Public()`
4. **Compra sin login**: Las compras pueden realizarse sin autenticación (Guest Checkout)

### Rutas Públicas (No requieren token):
- `POST /api/customers` - Crear customer
- `POST /api/orders` - Crear orden
- `POST /api/payments` - Crear pago
- `POST /api/payments/process` - Procesar pago
- `GET /api/products` - Ver productos
- `GET /api/categories` - Ver categorías
- `POST /api/auth/login` - Login
- `POST /api/users` - Registro

Ver documentación completa en `FLUJO_AUTENTICACION_OPCIONAL.md`

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

- **Crear pago**: `POST /api/payments` - Crea un pago asociado a una orden
- **Procesar pago**: `POST /api/payments/process` - Procesa el pago y actualiza inventario
- **Simulación**: Soporta simulación de éxito/fallo para pruebas
- **Actualización automática**: Al confirmar pago exitoso, se actualiza el stock automáticamente

Ver documentación en `src/modules/payments/README.md` y `src/modules/payments/SIMULACION_PAGOS.md`

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
