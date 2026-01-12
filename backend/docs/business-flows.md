# 🔄 Flujos de Negocio

Documentación de los flujos principales del sistema Marketplace.

## 🛒 Flujo de Compra

### Opción 1: Guest Checkout (Sin Login)

```
┌─────────────┐
│   Cliente   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ 1. Crear Cliente │
│ POST /customers  │
└──────┬───────────┘
       │
       ▼
┌─────────────────┐
│ 2. Crear Orden  │
│ POST /orders    │
│ (con items)     │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ 3. Crear Pago   │
│ POST /payments  │
│ (asociado a     │
│  la orden)      │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ 4. Procesar Pago│
│ POST /payments/ │
│ process         │
│ - Valida pago   │
│ - Actualiza     │
│   inventario    │
│ - Cambia estado │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ 5. Confirmación │
│ Orden: completed│
│ Pago: completed │
└─────────────────┘
```

**Ventajas:**
- ✅ Experiencia rápida
- ✅ Sin fricción de registro
- ✅ Ideal para compras únicas

**Desventajas:**
- ❌ No hay historial de compras
- ❌ No se guardan datos para futuras compras

### Opción 2: Compra con Login

```
┌─────────────┐
│   Usuario   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ 1. Login        │
│ POST /auth/login│
│ (obtiene token) │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ 2. Obtener      │
│ Perfil          │
│ GET /auth/      │
│ profile         │
│ (recupera datos)│
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ 3. Crear Orden  │
│ POST /orders    │
│ (con user_id)   │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ 4. Crear Pago   │
│ POST /payments  │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ 5. Procesar Pago│
│ POST /payments/ │
│ process         │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ 6. Ver Historial│
│ GET /orders     │
│ (historial de   │
│  compras)       │
└─────────────────┘
```

**Ventajas:**
- ✅ Historial de compras
- ✅ Datos guardados
- ✅ Experiencia personalizada

## 📦 Flujo de Gestión de Productos

### Crear Producto con Variantes

```
┌─────────────────┐
│ 1. Crear        │
│ Categoría       │
│ POST /categories│
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ 2. Crear        │
│ Producto        │
│ POST /products  │
│ (base)          │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ 3. Crear        │
│ Variantes       │
│ POST /product-  │
│ variants        │
│ (tallas, colores│
│  stock, precios)│
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ 4. Producto     │
│ Listo           │
│ (visible en     │
│  catálogo)      │
└─────────────────┘
```

### Búsqueda y Filtrado

```
┌─────────────────┐
│ Usuario busca   │
│ productos       │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ GET /products   │
│ ?search=...     │
│ &category_id=...│
│ &size=...       │
│ &color=...      │
│ &min_price=...  │
│ &max_price=...  │
│ &page=...       │
│ &limit=...      │
│ &sortBy=...     │
│ &order=...      │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Backend filtra   │
│ - Por nombre     │
│ - Por categoría  │
│ - Por variantes  │
│ - Por precio     │
│ - Ordena         │
│ - Pagina         │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Retorna productos│
│ filtrados        │
└─────────────────┘
```

## 💳 Flujo de Pagos

### Procesamiento de Pago

```
┌─────────────────┐
│ 1. Crear Pago   │
│ POST /payments  │
│ - order_id      │
│ - amount        │
│ - method        │
│ - card info     │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ 2. Validar      │
│ - Orden existe  │
│ - Monto correcto│
│ - Estado válido │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ 3. Procesar     │
│ POST /payments/ │
│ process         │
│ - Simula pago   │
│   (para pruebas)│
└──────┬──────────┘
       │
       ├─── Éxito ───┐
       │             │
       ▼             ▼
┌─────────────┐  ┌─────────────┐
│ 4a. Éxito   │  │ 4b. Fallo   │
│ - Status:   │  │ - Status:   │
│   completed │  │   failed    │
│ - Actualiza │  │ - No cambia │
│   inventario│  │   inventario│
│ - Orden:    │  │ - Orden:    │
│   completed │  │   pending   │
└─────────────┘  └─────────────┘
```

### Actualización de Inventario

Cuando un pago es exitoso:

```
┌─────────────────┐
│ Pago completado │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Para cada item  │
│ en la orden:    │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ 1. Obtener      │
│ variante        │
│ (si aplica)     │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ 2. Restar stock │
│ stock -=        │
│ quantity        │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ 3. Guardar      │
│ cambios         │
└─────────────────┘
```

## 📊 Flujo de Gestión de Inventario

### Actualización de Stock

```
┌─────────────────┐
│ Admin actualiza │
│ variante        │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ PUT /product-   │
│ variants/:id    │
│ { stock: 50 }   │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Validar:        │
│ - Stock >= 0    │
│ - No negativo   │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Actualizar BD   │
└─────────────────┘
```

### Verificación de Disponibilidad

```
┌─────────────────┐
│ Usuario agrega  │
│ al carrito      │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Verificar stock │
│ - Obtener       │
│   variante      │
│ - Comparar      │
│   stock vs      │
│   cantidad      │
└──────┬──────────┘
       │
       ├─── Disponible ───┐
       │                  │
       ▼                  ▼
┌─────────────┐    ┌─────────────┐
│ Permitir    │    │ Rechazar    │
│ agregar     │    │ - Mostrar   │
│             │    │   error     │
└─────────────┘    └─────────────┘
```

## 🔍 Flujo de Búsqueda Avanzada

### Filtros Combinados

```
┌─────────────────┐
│ Usuario aplica  │
│ múltiples       │
│ filtros         │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ GET /products   │
│ ?search=camisa  │
│ &category_id=1  │
│ &size=M         │
│ &color=Azul     │
│ &min_price=10   │
│ &max_price=50   │
│ &page=1         │
│ &limit=20       │
│ &sortBy=price   │
│ &order=asc      │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Backend:        │
│ 1. Filtra por   │
│    nombre       │
│ 2. Filtra por   │
│    categoría    │
│ 3. Filtra por   │
│    variantes    │
│    (EXISTS)     │
│ 4. Filtra por   │
│    precio       │
│ 5. Ordena       │
│ 6. Pagina       │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Retorna         │
│ productos       │
│ filtrados       │
└─────────────────┘
```

## 📈 Flujo de Reportes (Futuro)

### Estadísticas de Ventas

```
┌─────────────────┐
│ Admin solicita  │
│ reporte         │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ GET /reports/   │
│ sales           │
│ ?start_date=... │
│ &end_date=...   │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Calcular:       │
│ - Total ventas  │
│ - Productos más │
│   vendidos      │
│ - Ingresos      │
│ - Órdenes       │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│ Retorna reporte │
└─────────────────┘
```

## 🔄 Estados de Órdenes

### Transición de Estados

```
pending
   │
   ▼
processing
   │
   ├─── completed (pago exitoso)
   │
   └─── cancelled (pago fallido o cancelación)
```

### Estados de Pagos

```
pending
   │
   ▼
processing
   │
   ├─── completed (pago exitoso)
   │
   └─── failed (pago rechazado)
```

## 📝 Notas Importantes

1. **Inventario se actualiza solo al confirmar pago exitoso**
2. **Las órdenes pueden tener múltiples intentos de pago**
3. **Los filtros se pueden combinar libremente**
4. **La paginación es opcional (si no se especifica, retorna todos)**
5. **El ordenamiento por defecto es `created_at DESC`**
