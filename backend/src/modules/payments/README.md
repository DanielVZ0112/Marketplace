# Módulo de Pagos

Este módulo gestiona los pagos de las órdenes del marketplace, incluyendo simulación de pasarelas de pago para pruebas.

## 🎯 Características

- ✅ Creación de pagos asociados a órdenes
- ✅ Procesamiento de pagos con simulación
- ✅ Actualización automática de inventario al confirmar pago
- ✅ Actualización de estado de órdenes
- ✅ Validación de montos y estados
- ✅ Soporte para múltiples métodos de pago
- ✅ Preparado para integración con pasarelas reales (Stripe, PayPal, Mercado Pago)

## 📋 Flujo de Pago

### 1. Crear Orden
Primero, el cliente crea una orden con estado `pending`:

```http
POST /api/orders
{
  "customer_id": 1,
  "user_id": null,
  "status": "pending",
  "items": [...]
}
```

### 2. Crear Pago
Luego, se crea un pago asociado a la orden:

```http
POST /api/payments
{
  "order_id": 1,
  "amount": 57.48,
  "payment_method": "credit_card",
  "payment_provider": "simulated",
  "metadata": {
    "card_last4": "4242",
    "card_brand": "visa"
  }
}
```

**Validaciones:**
- El `amount` debe coincidir exactamente con el `total` de la orden
- La orden no puede estar ya completada
- La orden debe existir

### 3. Procesar Pago (Simulación)

#### Pago Exitoso
```http
POST /api/payments/process
{
  "payment_id": "1",
  "simulate_success": true
}
```

**Lo que ocurre:**
1. ✅ El pago cambia a estado `completed`
2. ✅ La orden cambia a estado `completed`
3. ✅ Se actualiza el inventario (se reduce el stock de las variantes)
4. ✅ Se genera un `transaction_id` automático

#### Pago Fallido
```http
POST /api/payments/process
{
  "payment_id": "1",
  "simulate_success": false
}
```

**Lo que ocurre:**
1. ❌ El pago cambia a estado `failed`
2. ❌ La orden cambia a estado `failed`
3. ⚠️ El inventario NO se actualiza

## 🔄 Integración con Pasarelas Reales

Para integrar con pasarelas reales (Stripe, PayPal, Mercado Pago), modifica el `ProcessPaymentUseCase`:

```typescript
// En process-payment.usecase.ts
async execute(processPaymentData: ProcessPaymentDto): Promise<Payment> {
  // ... validaciones ...
  
  // Llamada a la pasarela real
  const paymentResult = await this.paymentGateway.process({
    amount: payment.amount,
    payment_method: payment.payment_method,
    // ... otros datos ...
  });
  
  if (paymentResult.success) {
    // Pago exitoso - actualizar inventario
    // ...
  } else {
    // Pago fallido
    // ...
  }
}
```

## 📊 Estados de Pago

- `pending`: Pago creado, esperando procesamiento
- `processing`: Pago en proceso (no usado en simulación)
- `completed`: Pago exitoso, inventario actualizado
- `failed`: Pago fallido
- `refunded`: Pago reembolsado (futuro)

## 📊 Estados de Orden

- `pending`: Orden creada, esperando pago
- `completed`: Orden pagada y completada
- `failed`: Pago fallido
- `cancelled`: Orden cancelada (futuro)

## 🔐 Seguridad

- Todos los endpoints requieren autenticación JWT (excepto los marcados como `@Public()`)
- Validación de montos para prevenir fraudes
- Transacciones de base de datos para garantizar consistencia
- Validación de stock antes de actualizar inventario

## 📝 Ejemplo Completo

```bash
# 1. Crear orden
POST /api/orders
{
  "customer_id": 1,
  "items": [
    {
      "product_variant_id": 1,
      "quantity": 2,
      "unit_price": 15.99
    }
  ]
}
# Respuesta: { "data": { "id": 1, "total": 31.98, ... } }

# 2. Crear pago
POST /api/payments
{
  "order_id": 1,
  "amount": 31.98,
  "payment_method": "credit_card"
}
# Respuesta: { "data": { "id": 1, "payment_status": "pending", ... } }

# 3. Procesar pago (éxito)
POST /api/payments/process
{
  "payment_id": "1",
  "simulate_success": true
}
# Respuesta: { "data": { "id": 1, "payment_status": "completed", ... } }
# ✅ Inventario actualizado
# ✅ Orden completada
```

## 🚀 Próximos Pasos

- [ ] Integración con Stripe
- [ ] Integración con PayPal
- [ ] Integración con Mercado Pago
- [ ] Webhooks para notificaciones de pago
- [ ] Reembolsos
- [ ] Historial de transacciones
- [ ] Reportes de pagos

