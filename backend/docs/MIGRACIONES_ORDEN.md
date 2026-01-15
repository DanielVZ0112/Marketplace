# 📋 Orden de Ejecución de Migraciones

## ✅ Verificación del Orden

Las migraciones están correctamente numeradas y se ejecutarán en el orden correcto:

### Orden de Ejecución

1. **1700000000000-InitialMigration.ts**
   - Crea todas las tablas base (categories, users, customers, products, product_variants, orders, order_items)
   - Establece relaciones y foreign keys
   - **Primera migración - Base del sistema**

2. **1700000001000-AddPaymentsTable.ts**
   - Agrega tabla `payments`
   - Establece relación con `orders`
   - **Depende de:** InitialMigration (tabla orders)

3. **1700000002000-AddImageUrlToProducts.ts**
   - Agrega columna `image_url` a tabla `products`
   - **Depende de:** InitialMigration (tabla products)

4. **1700000003000-AddImageUrlToProductVariants.ts**
   - Agrega columna `image_url` a tabla `product_variants`
   - **Depende de:** InitialMigration (tabla product_variants)

5. **1700000004000-UpdateProductImageUrls.ts**
   - Actualiza datos: establece `image_url` basado en `id` para productos existentes
   - **Depende de:** AddImageUrlToProducts (columna debe existir)

6. **1700000005000-UpdateProductVariantImageUrls.ts**
   - Actualiza datos: establece `image_url` de variantes basado en producto padre
   - **Depende de:** AddImageUrlToProductVariants y UpdateProductImageUrls

## 🔍 Verificación Técnica

### Numeración

Las migraciones usan timestamps en formato `1700000000000` (milisegundos desde epoch):

```
1700000000000  ← Más antigua (se ejecuta primero)
1700000001000  ← +1000ms
1700000002000  ← +2000ms
1700000003000  ← +3000ms
1700000004000  ← +4000ms
1700000005000  ← Más reciente (se ejecuta último)
```

### TypeORM Execution Order

TypeORM ejecuta las migraciones en **orden numérico ascendente** basándose en el nombre del archivo:

```typescript
// En data-source.ts
migrations: ['src/database/migrations/*.ts']
```

TypeORM ordena automáticamente por el número del timestamp en el nombre del archivo.

## ✅ Confirmación

**El orden de ejecución es CORRECTO** ✅

- ✅ Dependencias respetadas
- ✅ Numeración secuencial
- ✅ Sin conflictos
- ✅ Migraciones de estructura antes que migraciones de datos

## 🚀 Ejecución

Para ejecutar las migraciones en orden:

```bash
npm run migration:run
```

TypeORM ejecutará automáticamente:
1. InitialMigration
2. AddPaymentsTable
3. AddImageUrlToProducts
4. AddImageUrlToProductVariants
5. UpdateProductImageUrls
6. UpdateProductVariantImageUrls

## 📝 Notas

- Las migraciones de **estructura** (crear tablas/columnas) van antes que las de **datos** (actualizar valores)
- Todas las dependencias están correctamente ordenadas
- No hay migraciones circulares
- El orden es determinístico y reproducible
