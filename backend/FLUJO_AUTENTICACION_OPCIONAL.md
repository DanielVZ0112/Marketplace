# 🔐 Flujo de Autenticación Opcional - Marketplace

## 📋 Concepto Clave

Tu marketplace tiene **dos modos de compra**:

1. **Compra sin login (Guest Checkout)**: El usuario compra solo con datos de `customer`
2. **Compra con login**: El usuario se registra/inicia sesión y puede recuperar sus datos automáticamente

## 🎯 Flujo Completo

### **Escenario 1: Compra SIN Login (Guest)**

```
Usuario → Agrega productos al carrito → Checkout
  ↓
1. POST /api/customers (SIN TOKEN) ✅ @Public()
   → Crea customer con datos del formulario
   → Respuesta: { id: 1, first_name: "Juan", ... }
  ↓
2. POST /api/orders (SIN TOKEN) ✅ @Public() 
   → Crea orden con customer_id
   → Respuesta: { id: 1, customer_id: 1, total: 100, ... }
  ↓
3. POST /api/payments (SIN TOKEN) ✅ @Public()
   → Crea pago asociado a la orden
   → Respuesta: { id: 1, order_id: 1, amount: 100, ... }
  ↓
4. POST /api/payments/process (SIN TOKEN) ✅ @Public()
   → Procesa el pago y actualiza inventario
   → Respuesta: { id: 1, payment_status: "completed", ... }
```

**✅ NO necesita token en ningún momento**

### **Escenario 2: Compra CON Login**

```
Usuario → Se registra/inicia sesión → Agrega productos → Checkout
  ↓
1. POST /api/auth/login (SIN TOKEN) ✅ @Public()
   → Usuario se autentica
   → Respuesta: { access_token: "eyJhbGc...", ... }
  ↓
2. POST /api/customers (CON TOKEN) o GET /api/customers/me
   → Si ya tiene customer vinculado, lo obtiene
   → Si no, crea uno nuevo vinculado a su user_id
  ↓
3. POST /api/orders (CON TOKEN OPCIONAL)
   → Crea orden con customer_id Y user_id
   → user_id se obtiene del token automáticamente
  ↓
4. POST /api/payments (CON TOKEN OPCIONAL)
   → Crea pago (igual que sin login)
  ↓
5. POST /api/payments/process (CON TOKEN OPCIONAL)
   → Procesa pago (igual que sin login)
```

**✅ El token es OPCIONAL, pero si lo envías:**
- Puedes recuperar datos automáticamente
- Puedes ver tu historial de compras
- Puedes reutilizar datos en futuras compras

## 🔧 Configuración Actual

### **Rutas Públicas (NO requieren token):**
- ✅ `POST /api/customers` - Crear customer
- ✅ `POST /api/payments` - Crear pago
- ✅ `POST /api/payments/process` - Procesar pago
- ✅ `GET /api/products` - Ver productos
- ✅ `GET /api/categories` - Ver categorías
- ✅ `POST /api/auth/login` - Login
- ✅ `POST /api/users` - Registro

### **Rutas Protegidas (SÍ requieren token):**
- 🔒 `GET /api/customers` - Listar todos (admin)
- 🔒 `GET /api/customers/:id` - Ver customer específico
- 🔒 `GET /api/orders` - Ver mis órdenes (si estás logueado)
- 🔒 `GET /api/payments` - Ver mis pagos (si estás logueado)
- 🔒 `GET /api/auth/profile` - Ver mi perfil

## ⚠️ Problema Detectado

El endpoint `POST /api/orders` **NO tiene `@Public()`**, lo que significa que **requiere token**. 

**Esto está mal** porque según tu modelo de negocio, las compras deben ser posibles sin login.

## ✅ Solución

Hay dos opciones:

### **Opción 1: Hacer `POST /api/orders` público (Recomendado)**

```typescript
@Controller('orders')
export class OrdersController {
  @Public()  // ← Agregar esto
  @Post()
  async create(@Body() orderData: CreateOrderDto) {
    // ...
  }
}
```

**Ventajas:**
- Permite compras sin login
- Simple y directo
- El `user_id` puede ser `null` en la orden

### **Opción 2: Hacer el token opcional en el guard**

Modificar el `JwtAuthGuard` para que si no hay token, simplemente continúe sin autenticar (pero esto es más complejo).

## 🎯 Recomendación Final

**Hacer `POST /api/orders` público** porque:

1. ✅ Permite compras sin login (tu requisito principal)
2. ✅ Si el usuario envía token, puedes extraer el `user_id` del token y vincularlo
3. ✅ Si no envía token, `user_id` será `null` (como está diseñado)

## 📝 Cómo Funciona en el Frontend

### **Sin Login:**
```typescript
// Frontend - Zustand + React Query
const checkout = async (customerData, cartItems) => {
  // 1. Crear customer (sin token)
  const customer = await fetch('/api/customers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customerData)
  });

  // 2. Crear orden (sin token)
  const order = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customer_id: customer.id,
      user_id: null,  // ← Sin login
      items: cartItems
    })
  });

  // 3. Crear y procesar pago (sin token)
  // ...
};
```

### **Con Login:**
```typescript
// Frontend - Con token
const checkout = async (cartItems) => {
  const token = localStorage.getItem('access_token');

  // 1. Obtener o crear customer (con token)
  const customer = await fetch('/api/customers/me', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  // 2. Crear orden (con token - user_id se obtiene del token)
  const order = await fetch('/api/orders', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,  // ← Token opcional
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      customer_id: customer.id,
      user_id: null,  // ← Se puede obtener del token si quieres
      items: cartItems
    })
  });

  // 3. Crear y procesar pago (token opcional)
  // ...
};
```

## 🔑 Puntos Clave

1. **El token es OPCIONAL para comprar**: Puedes comprar sin login
2. **El token es ÚTIL si estás logueado**: Recuperas datos automáticamente
3. **Las rutas de creación deben ser públicas**: `POST /api/customers`, `POST /api/orders`, `POST /api/payments`
4. **Las rutas de consulta pueden ser protegidas**: `GET /api/orders` (ver mis órdenes), `GET /api/customers/:id`

## 🚀 Próximo Paso

Agregar `@Public()` al endpoint `POST /api/orders` para permitir compras sin login.

