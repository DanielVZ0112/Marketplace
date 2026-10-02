import type {
  CotizacionItemEditable,
  CotizacionItemInput,
  InsumoRol,
  TrabajoErp,
  TrabajoInput,
} from "../../domain/CotizacionErp";

const ROLES: InsumoRol[] = ["prenda", "tinta", "papel", "cinta", "empaque"];

interface InsumoDraft {
  insumo_id: number | "";
  cantidad_usada: number;
}

export interface ItemDraft {
  clave: string;
  descripcion_producto: string;
  cliente_trae_prenda: boolean;
  minutos_produccion: number;
  cantidad: number;
  costo_fijo: number;
  insumos: Record<InsumoRol, InsumoDraft>;
}

export interface TrabajoDraft {
  clave: string;
  requiere_diseno: boolean;
  diseno_por_valor: boolean;
  valor_diseno: number;
  minutos_diseno: number;
  margen_esperado: number;
  descuento_porcentaje: number;
  items: ItemDraft[];
}

function insumosVacios(): Record<InsumoRol, InsumoDraft> {
  return {
    prenda: { insumo_id: "", cantidad_usada: 1 },
    tinta: { insumo_id: "", cantidad_usada: 1 },
    papel: { insumo_id: "", cantidad_usada: 1 },
    cinta: { insumo_id: "", cantidad_usada: 1 },
    empaque: { insumo_id: "", cantidad_usada: 1 },
  };
}

export function createItemDraft(costoFijo: number, clave?: string): ItemDraft {
  return {
    clave: clave ?? crypto.randomUUID(),
    descripcion_producto: "",
    cliente_trae_prenda: false,
    minutos_produccion: 0,
    cantidad: 1,
    costo_fijo: costoFijo,
    insumos: insumosVacios(),
  };
}

export function createTrabajoDraft(costoFijo: number, clave?: string): TrabajoDraft {
  return {
    clave: clave ?? crypto.randomUUID(),
    requiere_diseno: true,
    diseno_por_valor: false,
    valor_diseno: 0,
    minutos_diseno: 0,
    margen_esperado: 45,
    descuento_porcentaje: 0,
    items: [createItemDraft(costoFijo, clave ? "borrador-inicial" : undefined)],
  };
}

export function draftsFromCotizacion(trabajos: TrabajoErp[]): TrabajoDraft[] {
  return trabajos.map((trabajo) => ({
    clave: crypto.randomUUID(),
    requiere_diseno: trabajo.requiere_diseno,
    diseno_por_valor: trabajo.diseno_por_valor,
    valor_diseno: Number(trabajo.valor_diseno),
    minutos_diseno: Number(trabajo.minutos_diseno),
    margen_esperado: Number(trabajo.margen_esperado),
    descuento_porcentaje: Number(trabajo.descuento_porcentaje),
    items: trabajo.itemsEdicion.map((item) => itemDraftFromEditable(item)),
  }));
}

function itemDraftFromEditable(item: CotizacionItemEditable): ItemDraft {
  const draft = createItemDraft(item.costo_fijo);
  draft.descripcion_producto = item.descripcion_producto;
  draft.cliente_trae_prenda = item.cliente_trae_prenda;
  draft.minutos_produccion = Number(item.minutos_produccion);
  draft.cantidad = Number(item.cantidad);
  draft.costo_fijo = Number(item.costo_fijo);
  for (const rol of ROLES) {
    draft.insumos[rol] = { insumo_id: "", cantidad_usada: 1 };
  }
  for (const linea of item.insumos) {
    draft.insumos[linea.rol] = {
      insumo_id: linea.insumo_id,
      cantidad_usada: linea.rol === "prenda" ? 1 : Number(linea.cantidad_usada),
    };
  }
  return draft;
}

export function cloneItemDraft(item: ItemDraft): ItemDraft {
  return {
    clave: crypto.randomUUID(),
    descripcion_producto: item.descripcion_producto,
    cliente_trae_prenda: item.cliente_trae_prenda,
    minutos_produccion: item.minutos_produccion,
    cantidad: item.cantidad,
    costo_fijo: item.costo_fijo,
    insumos: {
      prenda: { ...item.insumos.prenda },
      tinta: { ...item.insumos.tinta },
      papel: { ...item.insumos.papel },
      cinta: { ...item.insumos.cinta },
      empaque: { ...item.insumos.empaque },
    },
  };
}

export function toTrabajoInput(draft: TrabajoDraft): TrabajoInput {
  return {
    requiere_diseno: draft.requiere_diseno,
    diseno_por_valor: draft.requiere_diseno && draft.diseno_por_valor,
    valor_diseno:
      draft.requiere_diseno && draft.diseno_por_valor ? Number(draft.valor_diseno) : 0,
    minutos_diseno:
      draft.requiere_diseno && !draft.diseno_por_valor ? Number(draft.minutos_diseno) : 0,
    margen_esperado: Number(draft.margen_esperado),
    descuento_porcentaje: Number(draft.descuento_porcentaje),
    items: draft.items.map(toItemInput),
  };
}

function toItemInput(draft: ItemDraft): CotizacionItemInput {
  const roles = ROLES.filter((rol) => {
    if (rol === "prenda" && draft.cliente_trae_prenda) {
      return false;
    }
    return draft.insumos[rol].insumo_id !== "";
  });

  return {
    descripcion_producto: draft.descripcion_producto.trim(),
    cliente_trae_prenda: draft.cliente_trae_prenda,
    minutos_produccion: Number(draft.minutos_produccion),
    cantidad: Number(draft.cantidad),
    costo_fijo: Number(draft.costo_fijo),
    insumos: roles.map((rol) => ({
      insumo_id: Number(draft.insumos[rol].insumo_id),
      rol,
      cantidad_usada: rol === "prenda" ? 1 : Number(draft.insumos[rol].cantidad_usada),
    })),
  };
}
