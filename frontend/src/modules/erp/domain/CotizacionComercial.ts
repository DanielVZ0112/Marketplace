import type { CotizacionCalculoResponse, CotizacionErp, TrabajoErp } from "./CotizacionErp";

export interface LineaComercial {
  cantidad: number;
  descripcion: string;
  precio_unitario: number;
  subtotal: number;
}

export interface CotizacionComercial {
  numero?: number;
  fecha: string;
  cliente_nombre: string;
  cliente_contacto: string;
  lineas: LineaComercial[];
  total: number;
}

export function fechaLocalIso(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function comercialDesdeCotizacion(cotizacion: CotizacionErp): CotizacionComercial {
  return {
    numero: cotizacion.id,
    fecha: cotizacion.fecha,
    cliente_nombre: cotizacion.cliente_nombre,
    cliente_contacto: cotizacion.cliente_contacto,
    total: cotizacion.total_precio,
    lineas: lineasDesdeTrabajos(cotizacion.trabajos ?? []),
  };
}

export function comercialDesdeCalculo(
  clienteNombre: string,
  clienteContacto: string,
  calculo: CotizacionCalculoResponse,
): CotizacionComercial {
  return {
    fecha: fechaLocalIso(),
    cliente_nombre: clienteNombre,
    cliente_contacto: clienteContacto,
    total: calculo.total_precio,
    lineas: calculo.trabajos.flatMap((trabajo, index) => [
      ...lineaDiseno(trabajo.precio_diseno, index, calculo.trabajos.length, false),
      ...trabajo.items.map((item) => ({
        cantidad: item.cantidad,
        descripcion: item.descripcion_producto,
        precio_unitario: item.precio_unitario_sugerido,
        subtotal: item.subtotal_precio,
      })),
    ]),
  };
}

function lineasDesdeTrabajos(trabajos: TrabajoErp[]): LineaComercial[] {
  return trabajos.flatMap((trabajo, index) => [
    ...lineaDiseno(trabajo.precio_diseno, index, trabajos.length, trabajo.diseno_en_items),
    ...trabajo.items.map((item) => ({
      cantidad: item.cantidad,
      descripcion: item.descripcion_producto,
      precio_unitario: item.precio_unitario_sugerido,
      subtotal: item.subtotal_precio,
    })),
  ]);
}

function lineaDiseno(
  precio: number,
  index: number,
  totalTrabajos: number,
  disenoEnItems: boolean,
): LineaComercial[] {
  if (disenoEnItems || precio <= 0) {
    return [];
  }
  return [
    {
      cantidad: 1,
      descripcion: totalTrabajos > 1 ? `Diseño ${index + 1}` : "Diseño",
      precio_unitario: precio,
      subtotal: precio,
    },
  ];
}
