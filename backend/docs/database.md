# 🗄️ Base de Datos

Documentación sobre la estructura de la base de datos, migraciones y seeders.

## 📊 Esquema de Base de Datos

### Diagrama de Entidades

```
┌─────────────┐
│   Users     │
│─────────────│
│ id (PK)     │
│ email       │
│ password    │
│ is_active   │
└──────┬──────┘
       │
       │ 1:1
       ▼
┌─────────────┐
│  Customers  │
│─────────────│
│ id (PK)     │
│ user_id (FK)│
│ name        │
│ email       │
│ phone       │
└──────┬──────┘
       │
       │ 1:N
       ▼
┌─────────────┐
│   Orders    │
│─────────────│
│ id (PK)     │
│ customer_id │
│ total       │
│ status      │
└──────┬──────┘
       │
       │ 1:N
       ▼
┌─────────────┐      ┌─────────────┐
│ Order Items │      │  Payments   │
│─────────────│      │─────────────│
│ id (PK)     │      │ id (PK)     │
│ order_id    │      │ order_id    │
│ product_id  │      │ amount      │
│ variant_id  │      │ status      │
│ quantity    │      │ method      │
│ price       │      └─────────────┘
└──────┬──────┘
       │
       │ N:1
       ▼
┌─────────────┐
│  Products   │
│─────────────│
│ id (PK)     │
│ name        │
│ description │
│ price       │
│ category_id │
│ is_active   │
└──────┬──────┘
       │
       │ 1:N
       ▼
┌─────────────┐      ┌─────────────┐
│   Product   │      │ Categories  │
│  Variants   │      │─────────────│
│─────────────│      │ id (PK)     │
│ id (PK)     │      │ name        │
│ product_id  │      │ slug        │
│ size        │      │ description │
│ color       │      └─────────────┘
│ stock       │
│ price       │
│ sku         │
└─────────────┘
```

## 🔄 Migraciones

### Ejecutar Migraciones

```bash
# Ejecutar todas las migraciones pendientes
npm run migration:run

# Revertir última migración
npm run migration:revert

# Generar nueva migración
npm run migration:generate -- -n NombreMigracion
```

### Ubicación

Las migraciones se encuentran en: `src/database/migrations/`

### Estructura de una Migración

```typescript
import { MigrationInterface, QueryRunner } from 'typeorm';

export class NombreMigracion1234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Código para aplicar la migración
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Código para revertir la migración
  }
}
```

## 🌱 Seeders

### Ejecutar Seeders

```bash
npm run seed
```

### Ubicación

Los seeders se encuentran en: `src/database/seeders/`

### Datos Iniciales

Los seeders crean:

- **Categorías** - Categorías de ejemplo
- **Productos** - Productos de ejemplo con variantes
- **Usuarios** - Usuarios de prueba

### Ejemplo de Seeder

```typescript
import { DataSource } from 'typeorm';
import { Category } from '../entities/category.entity';

export async function seedCategories(dataSource: DataSource) {
  const categoryRepository = dataSource.getRepository(Category);
  
  const categories = [
    { name: 'Ropa', slug: 'ropa' },
    { name: 'Electrónica', slug: 'electronica' },
  ];
  
  await categoryRepository.save(categories);
}
```

## 📋 Entidades Principales

### Users

```typescript
{
  id: number (PK, auto-increment)
  email: string (unique)
  password: string (hashed)
  is_active: boolean
  created_at: timestamp
  updated_at: timestamp
  deleted_at: timestamp (nullable, soft delete)
}
```

### Customers

```typescript
{
  id: number (PK)
  user_id: number (FK, nullable)
  name: string
  email: string
  phone: string (nullable)
  address: string (nullable)
  city: string (nullable)
  country: string (nullable)
  created_at: timestamp
  updated_at: timestamp
  deleted_at: timestamp (nullable)
}
```

### Products

```typescript
{
  id: number (PK)
  name: string
  description: text
  price: decimal
  image_url: string (nullable)
  category_id: number (FK)
  is_active: boolean
  created_at: timestamp
  updated_at: timestamp
  deleted_at: timestamp (nullable)
}
```

### Product Variants

```typescript
{
  id: number (PK)
  product_id: number (FK)
  size: string (nullable)
  color: string (nullable)
  stock: number
  price: decimal (nullable, hereda de producto si null)
  sku: string (nullable, unique)
  image_url: string (nullable)
  created_at: timestamp
  updated_at: timestamp
  deleted_at: timestamp (nullable)
}
```

### Orders

```typescript
{
  id: number (PK)
  customer_id: number (FK)
  total: decimal
  status: enum ('pending', 'processing', 'completed', 'cancelled')
  shipping_address: string
  shipping_city: string
  shipping_country: string
  created_at: timestamp
  updated_at: timestamp
  deleted_at: timestamp (nullable)
}
```

### Order Items

```typescript
{
  id: number (PK)
  order_id: number (FK)
  product_id: number (FK)
  variant_id: number (FK, nullable)
  quantity: number
  price: decimal
  created_at: timestamp
  updated_at: timestamp
}
```

### Payments

```typescript
{
  id: number (PK)
  order_id: number (FK)
  amount: decimal
  status: enum ('pending', 'processing', 'completed', 'failed')
  payment_method: string
  transaction_id: string (nullable)
  created_at: timestamp
  updated_at: timestamp
  deleted_at: timestamp (nullable)
}
```

### Categories

```typescript
{
  id: number (PK)
  name: string
  slug: string (unique)
  description: text (nullable)
  created_at: timestamp
  updated_at: timestamp
  deleted_at: timestamp (nullable)
}
```

## 🔒 Soft Delete

Todas las entidades principales implementan **Soft Delete**:

- `deleted_at` se establece en lugar de eliminar físicamente
- Las consultas filtran automáticamente registros eliminados
- Permite recuperación de datos

### Ejemplo

```typescript
// En lugar de DELETE
await repository.delete({ id: 1 });

// Se usa soft delete
await repository.softDelete({ id: 1 });
// Establece deleted_at = NOW()
```

## 🔍 Índices

### Índices Principales

- `users.email` - Unique index
- `customers.user_id` - Foreign key index
- `products.category_id` - Foreign key index
- `product_variants.product_id` - Foreign key index
- `product_variants.sku` - Unique index
- `orders.customer_id` - Foreign key index
- `order_items.order_id` - Foreign key index
- `payments.order_id` - Foreign key index
- `categories.slug` - Unique index

## 🔄 Relaciones

### Relaciones Principales

1. **User ↔ Customer** (1:1)
   - Un usuario puede tener un cliente asociado
   - Un cliente puede tener un usuario (opcional, para Guest)

2. **Customer ↔ Orders** (1:N)
   - Un cliente puede tener múltiples órdenes

3. **Order ↔ Order Items** (1:N)
   - Una orden tiene múltiples items

4. **Order ↔ Payments** (1:N)
   - Una orden puede tener múltiples pagos (reintentos)

5. **Product ↔ Product Variants** (1:N)
   - Un producto puede tener múltiples variantes

6. **Product ↔ Category** (N:1)
   - Múltiples productos pertenecen a una categoría

## 🛠️ Mantenimiento

### Backup

```bash
# Backup de la base de datos
pg_dump -U postgres marketplace_db > backup.sql

# Restaurar backup
psql -U postgres marketplace_db < backup.sql
```

### Limpieza

```bash
# Limpiar registros eliminados (soft delete) después de X días
# (Requiere script personalizado)
```

### Optimización

- Ejecutar `VACUUM` periódicamente
- Revisar índices no utilizados
- Monitorear queries lentas

## 📚 Referencias

- [TypeORM Documentation](https://typeorm.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Database Migrations Best Practices](https://typeorm.io/migrations)
