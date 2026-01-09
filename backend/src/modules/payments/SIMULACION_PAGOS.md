# 🧪 Guía de Simulación de Pagos

## 📋 ¿Cómo Simular Pagos?

El módulo de pagos incluye una funcionalidad de simulación que permite probar el flujo completo sin necesidad de integrar con pasarelas reales.

## 🔄 Flujo Completo

### Paso 1: Crear una Orden

```http
POST /api/orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "customer_id": 1,
  "user_id": null,
  "status": "pending",
  "items": [
    {
      "product_variant_id": 1,
      "quantity": 2,
      "unit_price": 15.99
    }
  ]
}
```

**Respuesta:**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Orden creada exitosamente",
  "data": {
    "id": 1,
    "customer_id": 1,
    "status": "pending",
    "total": 31.98,
    "items": [...]
  }
}
```

### Paso 2: Crear un Pago

```http
POST /api/payments
Authorization: Bearer {token}
Content-Type: application/json

{
  "order_id": 1,
  "amount": 31.98,
  "payment_method": "credit_card",
  "payment_provider": "simulated",
  "metadata": {
    "card_last4": "4242",
    "card_brand": "visa"
  }
}
```

**Importante:** El `amount` debe coincidir exactamente con el `total` de la orden.

**Respuesta:**
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Pago creado exitosamente",
  "data": {
    "id": 1,
    "order_id": 1,
    "amount": 31.98,
    "payment_method": "credit_card",
    "payment_status": "pending",
    "payment_provider": "simulated",
    "created_at": "2026-01-07T10:00:00.000Z"
  }
}
```

### Paso 3: Procesar el Pago

#### ✅ Simular Pago Exitoso

```http
POST /api/payments/process
Authorization: Bearer {token}
Content-Type: application/json

{
  "payment_id": "1",
  "simulate_success": true
}
```

**Lo que ocurre:**
1. ✅ El pago cambia a `payment_status: "completed"`
2. ✅ La orden cambia a `status: "completed"`
3. ✅ Se reduce el stock de las variantes de productos
4. ✅ Se genera un `transaction_id` automático

**Respuesta:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Pago procesado exitosamente",
  "data": {
    "id": 1,
    "order_id": 1,
    "amount": 31.98,
    "payment_status": "completed",
    "transaction_id": "TXN-1704628800000-1",
    "order": {
      "id": 1,
      "status": "completed",
      "total": 31.98
    }
  }
}
```

#### ❌ Simular Pago Fallido

```http
POST /api/payments/process
Authorization: Bearer {token}
Content-Type: application/json

{
  "payment_id": "1",
  "simulate_success": false
}
```

**Lo que ocurre:**
1. ❌ El pago cambia a `payment_status: "failed"`
2. ❌ La orden cambia a `status: "failed"`
3. ⚠️ El inventario NO se actualiza (el stock se mantiene)

**Respuesta:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Pago procesado exitosamente",
  "data": {
    "id": 1,
    "order_id": 1,
    "amount": 31.98,
    "payment_status": "failed",
    "metadata": {
      "failure_reason": "Simulación de pago fallido"
    },
    "order": {
      "id": 1,
      "status": "failed",
      "total": 31.98
    }
  }
}
```

## 🎯 Casos de Uso

### Caso 1: Pago Exitoso Completo

```bash
# 1. Crear orden
curl -X POST http://localhost:3000/api/orders \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": 1,
    "status": "pending",
    "items": [{"product_variant_id": 1, "quantity": 2, "unit_price": 15.99}]
  }'

# 2. Crear pago
curl -X POST http://localhost:3000/api/payments \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": 1,
    "amount": 31.98,
    "payment_method": "credit_card"
  }'

# 3. Procesar pago (éxito)
curl -X POST http://localhost:3000/api/payments/process \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "payment_id": "1",
    "simulate_success": true
  }'
```

### Caso 2: Verificar Inventario Actualizado

Después de un pago exitoso, verifica que el stock se haya reducido:

```http
GET /api/product-variants/1
```

El `stock` de la variante debe haber disminuido según la cantidad comprada.

## ⚠️ Validaciones Importantes

1. **Monto debe coincidir:** El `amount` del pago debe ser exactamente igual al `total` de la orden
2. **Orden no completada:** No se puede crear un pago para una orden ya completada
3. **Stock disponible:** Al procesar un pago exitoso, se valida que haya stock suficiente
4. **Pago pendiente:** Solo se pueden procesar pagos con estado `pending`

## 🔄 Integración con Frontend

### Flujo Recomendado:

1. **Frontend (Zustand + React Query):**
   - Usuario agrega productos al carrito
   - Al hacer checkout, se crea la orden
   - Se crea el pago
   - Se procesa el pago

2. **Backend:**
   - Al confirmar el pago exitoso:
     - Actualiza el inventario
     - Cambia el estado de la orden
     - Retorna la respuesta

3. **Frontend:**
   - Al recibir confirmación:
     - Invalida la caché de productos (React Query)
     - Actualiza el estado del carrito (Zustand)
     - Muestra confirmación al usuario

### Ejemplo con React Query:

```typescript
// En el frontend
const processPayment = useMutation({
  mutationFn: async (paymentId: string) => {
    const response = await fetch('/api/payments/process', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payment_id: paymentId,
        simulate_success: true,
      }),
    });
    return response.json();
  },
  onSuccess: () => {
    // Invalidar caché de productos para actualizar inventario
    queryClient.invalidateQueries(['products']);
    queryClient.invalidateQueries(['product-variants']);
    // Limpiar carrito
    cartStore.clear();
  },
});
```

## 🚀 Preparado para Producción

El código está preparado para integrar pasarelas reales. Solo necesitas:

1. Modificar `ProcessPaymentUseCase` para llamar a la API de la pasarela
2. Reemplazar la lógica de simulación con la llamada real
3. Manejar webhooks de la pasarela (opcional)

El resto de la lógica (actualización de inventario, estados, etc.) permanece igual.

