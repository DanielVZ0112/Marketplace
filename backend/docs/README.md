# 📚 Documentación del Backend

Bienvenido a la documentación completa del Marketplace Backend API.

## 📖 Índice

1. [Guía de Inicio Rápido](./getting-started.md) - Configuración e instalación
2. [Arquitectura](./architecture.md) - Arquitectura Hexagonal y estructura del proyecto
3. [Referencia de API](./api/README.md) - Documentación completa de endpoints
4. [Autenticación](./authentication.md) - Sistema de autenticación JWT
5. [Base de Datos](./database.md) - Migraciones, seeders y esquema
6. [Flujos de Negocio](./business-flows.md) - Flujos principales del sistema

## 🚀 Inicio Rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env

# 3. Ejecutar migraciones
npm run migration:run

# 4. Ejecutar seeders
npm run seed

# 5. Iniciar servidor
npm run start:dev
```

**Base URL:** `http://localhost:3000/api`

## 📋 Características Principales

- ✅ **Arquitectura Hexagonal** - Separación clara de responsabilidades
- ✅ **Autenticación JWT Opcional** - Login opcional para compras
- ✅ **Filtros Avanzados** - Búsqueda, paginación y ordenamiento
- ✅ **Sistema de Pagos** - Con simulación para pruebas
- ✅ **Soft Delete** - Eliminación lógica de registros
- ✅ **Validación de Datos** - Con class-validator
- ✅ **Respuestas Estandarizadas** - Formato consistente

## 🔗 Enlaces Rápidos

- [Postman Collection](./api/Marketplace-API.postman_collection.json) - Importa esta colección para probar la API
- [README Principal](../README.md) - Documentación general del proyecto
