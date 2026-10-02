# 🛠️ Especificación Técnica: ERP para D-E-J Creaciones (Sublimación)

## 📌 Contexto del Proyecto
Se requiere integrar un sistema ERP en la ruta `/erp/` dentro del proyecto actual (Marketplace NestJS + React).
El ERP servirá para gestionar un negocio de sublimación y estampado personalizado, parametrizando insumos, mano de obra, cotizaciones dinámicas y generación de cotizaciones en PDF.

## 📐 Lógica de Negocio y Costeo

### 1. Parámetros de Mano de Obra y Costos Fijos
- Costo por minuto de trabajo (Diseño / Producción) = $143.61 COP (Basado en SMLMV).
- Depreciación de maquinaria por prenda = $79 COP.
- Costos fijos indirectos por prenda = Configurable (rango entre $500 y $1.500 COP).

### 2. Algoritmo del Cotizador
Para un ítem cotizado, el costo directo se calcula con la siguiente fórmula:
`Costo Directo = (Costo Prenda) + (Costo Tinta) + (Costo Papel) + (Costo Cinta) + (Costo Empaque) + (Minutos Diseño * Costo Minuto) + (Minutos Producción * Costo Minuto) + Depreciación + Costo Fijo`

**Reglas de variabilidad:**
- Si `cliente_trae_prenda == true` -> `Costo Prenda = 0`.
- Si `requiere_diseno == false` -> `Minutos Diseño = 0`.
- `Precio Venta Sugerido = Costo Directo / (1 - Margen Esperado %)`

---

## 🗄️ Esquema de Base de Datos (Backend NestJS - TypeORM)

### Modulo: `erp-insumos`
- `id` (PK, auto-increment)
- `nombre` (string)
- `unidad_medida` (enum: 'ml', 'hoja', 'unidad', 'uso')
- `costo_unitario` (decimal)
- `stock_actual` (decimal)
- `stock_minimo` (decimal)

### Modulo: `erp-cotizaciones`
- `id` (PK)
- `cliente_nombre` (string)
- `cliente_contacto` (string)
- `fecha` (date)
- `total_costo` (decimal)
- `total_precio` (decimal)
- `estado` (enum: 'borrador', 'enviada', 'aprobada', 'rechazada')
- `items` (OneToMany -> CotizacionItem)

### Modulo: `erp-cotizacion-items`
- `id` (PK)
- `cotizacion_id` (FK)
- `descripcion_producto` (string)
- `cliente_trae_prenda` (boolean)
- `requiere_diseno` (boolean)
- `cantidad` (int)
- `costo_unitario` (decimal)
- `precio_unitario` (decimal)
- `subtotal` (decimal)

---

## 🎨 Modulos Frontend (React Feature-Based Architecture)

Ubicación: `frontend/src/modules/erp/`

### Estructura de Capas:
- `domain/`: Tipos TypeScript (`Insumo.ts`, `Cotizacion.ts`, `CosteoCalculo.ts`).
- `infrastructure/`: Repositorios API (`ErpInsumosApiRepository.ts`, `ErpCotizadorApiRepository.ts`).
- `application/`: Hooks de React Query (`useGetInsumos.ts`, `useCalcularCotizacion.ts`, `useGeneratePdf.ts`).
- `ui/`:
  - `components/SidebarErp.tsx`: Navegación con rutas `/erp/dashboard`, `/erp/cotizador`, `/erp/insumos`, etc.
  - `pages/CotizadorPage.tsx`: Formulario reactivo con sliders/switches para ajustar margenes y variables en tiempo real.
  - `pages/InsumosPage.tsx`: Tabla de gestión de materias primas.

---

## 📄 Formato del PDF de Cotización
El PDF generado debe contener:
1. Encabezado con marca "D-E-J Creaciones" e información de contacto.
2. Datos del Cliente y Fecha de Vencimiento de la oferta (7 días).
3. Tabla con: Cantidad, Detalle del Servicio/Producto, Precio Unitario, Subtotal.
4. Resumen con Subtotal, Descuentos (si aplica) y Total a Pagar.
5. Puntos de pago (Transferencia / Nequi / Bancolombia).