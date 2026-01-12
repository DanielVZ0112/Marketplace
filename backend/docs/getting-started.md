# 🚀 Guía de Inicio Rápido

Esta guía te ayudará a configurar y ejecutar el Marketplace Backend API desde cero.

## 📋 Requisitos Previos

- **Node.js** >= 18.x
- **PostgreSQL** >= 14.x
- **npm** o **yarn**
- **Git** (opcional, para clonar el repositorio)

## 🔧 Instalación

### 1. Clonar el Repositorio (si aplica)

```bash
git clone <repository-url>
cd backend
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto `backend/`:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_password_aqui
DB_NAME=marketplace_db

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=tu-clave-secreta-super-segura-minimo-32-caracteres
JWT_EXPIRES_IN=1d

# Frontend Configuration
FRONTEND_URL=http://localhost:5173
```

**⚠️ Importante:** 
- Cambia `JWT_SECRET` por una clave segura en producción
- Asegúrate de que la base de datos PostgreSQL esté corriendo
- El nombre de la base de datos (`DB_NAME`) se creará automáticamente si no existe

### 4. Crear Base de Datos

```bash
# Conectarse a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE marketplace_db;

# Salir
\q
```

### 5. Ejecutar Migraciones

```bash
# Ejecutar todas las migraciones pendientes
npm run migration:run
```

Esto creará todas las tablas necesarias en la base de datos.

### 6. Ejecutar Seeders (Datos Iniciales)

```bash
npm run seed
```

Esto poblará la base de datos con datos de ejemplo (categorías, productos, etc.).

### 7. Iniciar el Servidor

```bash
# Modo desarrollo (con hot-reload)
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

El servidor estará disponible en: `http://localhost:3000`

## ✅ Verificar Instalación

### 1. Verificar que el servidor está corriendo

```bash
curl http://localhost:3000/api/products
```

Deberías recibir una respuesta JSON con los productos.

### 2. Probar con Postman

1. Importa la colección desde `docs/api/Marketplace-API.postman_collection.json`
2. Ejecuta la petición `GET Products` (pública, no requiere autenticación)

## 🧪 Probar la API

### Endpoint Público (Sin autenticación)

```bash
# Obtener productos
curl http://localhost:3000/api/products

# Obtener categorías
curl http://localhost:3000/api/categories

# Obtener un producto por ID
curl http://localhost:3000/api/products/1
```

### Endpoint con Autenticación

```bash
# 1. Login para obtener token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "password123"}'

# 2. Usar el token en peticiones protegidas
curl http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer <tu-token-aqui>"
```

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run start:dev          # Inicia con hot-reload
npm run start:debug        # Inicia en modo debug

# Producción
npm run build              # Compila el proyecto
npm run start              # Inicia en producción
npm run start:prod         # Alias de start

# Base de Datos
npm run migration:generate  # Genera nueva migración
npm run migration:run       # Ejecuta migraciones
npm run migration:revert   # Revierte última migración
npm run seed               # Ejecuta seeders

# Calidad de Código
npm run lint               # Ejecuta linter
npm run format             # Formatea código

# Testing
npm run test               # Ejecuta tests unitarios
npm run test:e2e           # Ejecuta tests end-to-end
npm run test:cov           # Genera reporte de cobertura
```

## 🐛 Solución de Problemas

### Error: "Cannot connect to database"

**Solución:**
1. Verifica que PostgreSQL esté corriendo: `pg_isready`
2. Verifica las credenciales en `.env`
3. Asegúrate de que la base de datos existe

### Error: "JWT_SECRET is not defined"

**Solución:**
1. Verifica que el archivo `.env` existe
2. Verifica que `JWT_SECRET` está definido
3. Reinicia el servidor después de cambiar `.env`

### Error: "Table does not exist"

**Solución:**
1. Ejecuta las migraciones: `npm run migration:run`
2. Verifica que las migraciones se ejecutaron correctamente

### Puerto 3000 ya está en uso

**Solución:**
1. Cambia el puerto en `.env`: `PORT=3001`
2. O detén el proceso que está usando el puerto 3000

## 📚 Próximos Pasos

- Lee la [Referencia de API](./api/README.md) para conocer todos los endpoints
- Revisa la [Arquitectura](./architecture.md) para entender la estructura del proyecto
- Consulta [Autenticación](./authentication.md) para el sistema de auth
- Explora los [Flujos de Negocio](./business-flows.md) para entender el sistema completo

## 🆘 Soporte

Si encuentras problemas:

1. Revisa los logs del servidor
2. Verifica la configuración en `.env`
3. Consulta la documentación específica en `docs/`
4. Revisa los issues conocidos en el repositorio
