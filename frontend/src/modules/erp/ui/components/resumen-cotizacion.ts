import type { InsumoRol } from "../../domain/CotizacionErp";
import type { InsumoErp } from "../../domain/InsumoErp";
import type { ItemDraft, TrabajoDraft } from "./cotizador-draft";

const ROLES: InsumoRol[] = ["prenda", "tinta", "papel", "cinta", "empaque"];

function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export interface ResumenItemVivo {
  costoPorPieza: number;
  costoUnitario: number;
  precioUnitario: number | null;
  subtotalCosto: number;
  subtotalPrecio: number | null;
}

export interface ResumenTrabajoVivo {
  costoDiseno: number;
  precioDiseno: number | null;
  items: ResumenItemVivo[];
  totalCosto: number;
  totalPrecio: number | null;
}

export interface ResumenCotizacionVivo {
  trabajos: ResumenTrabajoVivo[];
  totalCosto: number;
  totalPrecio: number | null;
}

export function resumirCotizacion(
  trabajos: TrabajoDraft[],
  insumos: InsumoErp[],
  costoMinuto: number,
  depreciacionPorPrenda: number,
): ResumenCotizacionVivo {
  const costoPorId = new Map(insumos.map((insumo) => [insumo.id, Number(insumo.costo_unitario)]));
  const resumenes = trabajos.map((trabajo) =>
    resumirTrabajo(trabajo, costoPorId, costoMinuto, depreciacionPorPrenda),
  );
  const precios = resumenes.map((trabajo) => trabajo.totalPrecio);
  const totalPrecio = precios.every((precio) => precio !== null)
    ? roundMoney(precios.reduce((total, precio) => total + (precio ?? 0), 0))
    : null;

  return {
    trabajos: resumenes,
    totalCosto: roundMoney(resumenes.reduce((total, trabajo) => total + trabajo.totalCosto, 0)),
    totalPrecio,
  };
}

function resumirTrabajo(
  trabajo: TrabajoDraft,
  costoPorId: Map<number, number>,
  costoMinuto: number,
  depreciacionPorPrenda: number,
): ResumenTrabajoVivo {
  const margen = Number(trabajo.margen_esperado);
  const descuento = Number(trabajo.descuento_porcentaje);
  const margenValido = Number.isFinite(margen) && margen >= 0 && margen < 100;
  const descuentoValido = Number.isFinite(descuento) && descuento >= 0 && descuento <= 100;
  const costoDiseno = !trabajo.requiere_diseno
    ? 0
    : trabajo.diseno_por_valor
      ? roundMoney(Number(trabajo.valor_diseno) || 0)
      : roundMoney((Number(trabajo.minutos_diseno) || 0) * costoMinuto);
  const precioDiseno =
    margenValido && descuentoValido ? precioDesdeCosto(costoDiseno, margen, descuento) : null;
  const items = trabajo.items.map((item) =>
    resumirItem(item, costoPorId, costoMinuto, depreciacionPorPrenda, margen, descuento),
  );
  const precios = items.map((item) => item.subtotalPrecio);
  const totalPrecioItems = precios.every((precio) => precio !== null)
    ? roundMoney(precios.reduce((total, precio) => total + (precio ?? 0), 0))
    : null;

  return {
    costoDiseno,
    precioDiseno,
    items,
    totalCosto: roundMoney(
      costoDiseno + items.reduce((total, item) => total + item.subtotalCosto, 0),
    ),
    totalPrecio:
      precioDiseno === null || totalPrecioItems === null
        ? null
        : roundMoney(precioDiseno + totalPrecioItems),
  };
}

function resumirItem(
  item: ItemDraft,
  costoPorId: Map<number, number>,
  costoMinuto: number,
  depreciacionPorPrenda: number,
  margen: number,
  descuento: number,
): ResumenItemVivo {
  const materiaPorPieza = ROLES.reduce((total, rol) => {
    if (rol === "prenda" && item.cliente_trae_prenda) {
      return total;
    }
    const linea = item.insumos[rol];
    if (linea.insumo_id === "") {
      return total;
    }
    const costoUnitario = costoPorId.get(linea.insumo_id) ?? 0;
    const cantidadUsada = rol === "prenda" ? 1 : Number(linea.cantidad_usada) || 0;
    return total + roundMoney(cantidadUsada * costoUnitario);
  }, 0);
  const costoUnitario = roundMoney(
    materiaPorPieza +
      roundMoney((Number(item.minutos_produccion) || 0) * costoMinuto) +
      depreciacionPorPrenda +
      (Number(item.costo_fijo) || 0),
  );
  const margenValido = Number.isFinite(margen) && margen >= 0 && margen < 100;
  const descuentoValido = Number.isFinite(descuento) && descuento >= 0 && descuento <= 100;
  const cantidad = Number(item.cantidad);
  const unidades = Number.isFinite(cantidad) && cantidad > 0 ? cantidad : 0;
  const precioUnitario =
    margenValido && descuentoValido && unidades > 0
      ? precioDesdeCosto(costoUnitario, margen, descuento)
      : null;

  return {
    costoPorPieza: costoUnitario,
    costoUnitario,
    precioUnitario,
    subtotalCosto: roundMoney(costoUnitario * unidades),
    subtotalPrecio: precioUnitario === null ? null : roundMoney(precioUnitario * unidades),
  };
}

function precioDesdeCosto(costo: number, margen: number, descuento: number): number {
  const precioBase = roundMoney(costo / (1 - margen / 100));
  return roundMoney(precioBase * (1 - descuento / 100));
}
