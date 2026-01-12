# 📡 Referencia de API

Documentación completa de todos los endpoints disponibles en el Marketplace Backend API.

**Base URL:** `http://localhost:3000/api`

## 📋 Índice de Endpoints

- [Autenticación](#autenticación)
- [Productos](#productos)
- [Categorías](#categorías)
- [Clientes](#clientes)
- [Usuarios](#usuarios)
- [Órdenes](#órdenes)
- [Pagos](#pagos)
- [Variantes de Productos](#variantes-de-productos)

## 🔐 Convenciones

### Formato de Respuesta

Todas las respuestas exitosas siguen este formato:

```json
{
  "success": true,
  "message": "Mensaje descriptivo",
  "data": { ... }
}
```

### Códigos de Estado HTTP

- `200 OK` - Petición exitosa
- `201 Created` - Recurso creado exitosamente
- `400 Bad Request` - Error de validación
- `401 Unauthorized` - No autenticado
- `403 Forbidden` - No autorizado
- `404 Not Found` - Recurso no encontrado
- `500 Internal Server Error` - Error del servidor

### Autenticación

Para rutas protegidas, incluye el header:

```
Authorization: Bearer <token>
```

---

## 🔑 Autenticación

### POST /api/auth/login

Inicia sesión y obtiene un token JWT.

**Público:** ✅ Sí

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "is_active": true
    }
  }
}
```

### GET /api/auth/profile

Obtiene el perfil del usuario autenticado.

**Público:** ❌ No (requiere token)

**Response (200):**
```json
{
  "success": true,
  "message": "Perfil obtenido exitosamente",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "is_active": true
  }
}
```

---

## 📦 Productos

### GET /api/products

Lista todos los productos con filtros opcionales.

**Público:** ✅ Sí

**Query Parameters:**
- `search` (string, opcional) - Búsqueda por nombre
- `category_id` (number, opcional) - Filtrar por categoría
- `size` (string, opcional) - Filtrar por talla
- `color` (string, opcional) - Filtrar por color
- `min_price` (number, opcional) - Precio mínimo
- `max_price` (number, opcional) - Precio máximo
- `page` (number, opcional) - Página (default: 1)
- `limit` (number, opcional) - Items por página (default: 20, max: 100)
- `sortBy` (string, opcional) - Ordenar por: `name`, `price`, `created_at`
- `order` (string, opcional) - Orden: `asc` o `desc` (default: `desc`)

**Ejemplo:**
```
GET /api/products?search=camisa&category_id=1&page=1&limit=20&sortBy=price&order=asc
```

**Response (200):**
```json
{
  "success": true,
  "message": "Productos obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "name": "Camisa Azul",
      "description": "Camisa de algodón",
      "price": 29.99,
      "image_url": "https://...",
      "category_id": 1,
      "category": { ... },
      "variants": [ ... ]
    }
  ]
}
```

**Response con Paginación (200):**
```json
{
  "success": true,
  "message": "Productos obtenidos exitosamente",
  "data": {
    "data": [ ... ],
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

### GET /api/products/:id

Obtiene un producto por ID.

**Público:** ✅ Sí

**Response (200):**
```json
{
  "success": true,
  "message": "Producto obtenido exitosamente",
  "data": {
    "id": 1,
    "name": "Camisa Azul",
    "description": "Camisa de algodón",
    "price": 29.99,
    "image_url": "https://...",
    "category_id": 1,
    "category": {
      "id": 1,
      "name": "Ropa",
      "slug": "ropa"
    },
    "variants": [
      {
        "id": 1,
        "size": "M",
        "color": "Azul",
        "stock": 10,
        "price": 29.99
      }
    ]
  }
}
```

### POST /api/products

Crea un nuevo producto.

**Público:** ❌ No (requiere token)

**Request:**
```json
{
  "name": "Camisa Azul",
  "description": "Camisa de algodón",
  "price": 29.99,
  "image_url": "https://...",
  "category_id": 1,
  "is_active": true
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Producto creado exitosamente",
  "data": { ... }
}
```

### PUT /api/products/:id

Actualiza un producto existente.

**Público:** ❌ No (requiere token)

**Request:**
```json
{
  "name": "Camisa Azul Actualizada",
  "price": 34.99
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Producto actualizado exitosamente",
  "data": { ... }
}
```

---

## 🏷️ Categorías

### GET /api/categories

Lista todas las categorías.

**Público:** ✅ Sí

**Response (200):**
```json
{
  "success": true,
  "message": "Categorías obtenidas exitosamente",
  "data": [
    {
      "id": 1,
      "name": "Ropa",
      "slug": "ropa",
      "description": "Ropa y accesorios"
    }
  ]
}
```

### GET /api/categories/:id

Obtiene una categoría por ID.

**Público:** ✅ Sí

### POST /api/categories

Crea una nueva categoría.

**Público:** ❌ No (requiere token)

### PUT /api/categories/:id

Actualiza una categoría.

**Público:** ❌ No (requiere token)

---

## 👥 Clientes

### POST /api/customers

Crea un nuevo cliente (usado en Guest Checkout).

**Público:** ✅ Sí

**Request:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "phone": "+1234567890",
  "address": "Calle 123",
  "city": "Ciudad",
  "country": "País"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Cliente creado exitosamente",
  "data": {
    "id": 1,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    ...
  }
}
```

### GET /api/customers

Lista todos los clientes.

**Público:** ❌ No (requiere token)

### GET /api/customers/:id

Obtiene un cliente por ID.

**Público:** ❌ No (requiere token)

### PUT /api/customers/:id

Actualiza un cliente.

**Público:** ❌ No (requiere token)

---

## 👤 Usuarios

### POST /api/users

Registra un nuevo usuario.

**Público:** ✅ Sí

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Usuario creado exitosamente",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "is_active": true
  }
}
```

### GET /api/users

Lista todos los usuarios.

**Público:** ❌ No (requiere token)

### GET /api/users/:id

Obtiene un usuario por ID.

**Público:** ❌ No (requiere token)

### PUT /api/users/:id

Actualiza un usuario.

**Público:** ❌ No (requiere token)

---

## 🛒 Órdenes

### POST /api/orders

Crea una nueva orden.

**Público:** ✅ Sí (Guest Checkout)

**Request:**
```json
{
  "customer_id": 1,
  "items": [
    {
      "product_id": 1,
      "variant_id": 1,
      "quantity": 2,
      "price": 29.99
    }
  ],
  "total": 59.98,
  "shipping_address": "Calle 123",
  "shipping_city": "Ciudad",
  "shipping_country": "País"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Orden creada exitosamente",
  "data": {
    "id": 1,
    "customer_id": 1,
    "total": 59.98,
    "status": "pending",
    "items": [ ... ],
    ...
  }
}
```

### GET /api/orders

Lista todas las órdenes (del usuario autenticado si hay token).

**Público:** ❌ No (requiere token)

**Response (200):**
```json
{
  "success": true,
  "message": "Órdenes obtenidas exitosamente",
  "data": [ ... ]
}
```

### GET /api/orders/:id

Obtiene una orden por ID.

**Público:** ❌ No (requiere token)

### PUT /api/orders/:id

Actualiza una orden.

**Público:** ❌ No (requiere token)

---

## 💳 Pagos

### POST /api/payments

Crea un nuevo pago asociado a una orden.

**Público:** ✅ Sí

**Request:**
```json
{
  "order_id": 1,
  "amount": 59.98,
  "payment_method": "credit_card",
  "card_number": "4111111111111111",
  "card_expiry": "12/25",
  "card_cvv": "123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Pago creado exitosamente",
  "data": {
    "id": 1,
    "order_id": 1,
    "amount": 59.98,
    "status": "pending",
    ...
  }
}
```

### POST /api/payments/process

Procesa un pago y actualiza el inventario.

**Público:** ✅ Sí

**Request:**
```json
{
  "payment_id": 1,
  "simulate_success": true  // Para pruebas
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Pago procesado exitosamente",
  "data": {
    "id": 1,
    "status": "completed",
    "transaction_id": "txn_123456",
    ...
  }
}
```

### GET /api/payments

Lista todos los pagos.

**Público:** ❌ No (requiere token)

### GET /api/payments/:id

Obtiene un pago por ID.

**Público:** ❌ No (requiere token)

### GET /api/payments/order/:orderId

Obtiene todos los pagos de una orden.

**Público:** ❌ No (requiere token)

---

## 🎨 Variantes de Productos

### GET /api/product-variants

Lista todas las variantes.

**Público:** ❌ No (requiere token)

### GET /api/product-variants/:id

Obtiene una variante por ID.

**Público:** ❌ No (requiere token)

### POST /api/product-variants

Crea una nueva variante.

**Público:** ❌ No (requiere token)

**Request:**
```json
{
  "product_id": 1,
  "size": "M",
  "color": "Azul",
  "stock": 10,
  "price": 29.99,
  "sku": "CAM-M-AZ-001"
}
```

### PUT /api/product-variants/:id

Actualiza una variante.

**Público:** ❌ No (requiere token)

---

## 📝 Notas Adicionales

### Filtros de Productos

Los filtros se pueden combinar:

```
GET /api/products?search=camisa&category_id=1&size=M&color=Azul&min_price=10&max_price=50&page=1&limit=20&sortBy=price&order=asc
```

### Paginación

Cuando se usan `page` y `limit`, la respuesta incluye metadata:

```json
{
  "data": [ ... ],
  "total": 100,
  "page": 1,
  "limit": 20,
  "totalPages": 5
}
```

### Ordenamiento

- `sortBy`: `name`, `price`, `created_at`
- `order`: `asc` (ascendente) o `desc` (descendente)

## 🔗 Colección de Postman

Importa la colección completa desde:
`docs/api/Marketplace-API.postman_collection.json`
