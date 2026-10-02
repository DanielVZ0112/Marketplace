export type EstadoCotizacion = "borrador" | "enviada" | "aprobada" | "rechazada";

export type InsumoRol = "prenda" | "tinta" | "papel" | "cinta" | "empaque";

export interface CotizacionItemInsumoInput {
  insumo_id: number;
  rol: InsumoRol;
  cantidad_usada: number;
}

export interface CotizacionItemInput {
  descripcion_producto: string;
  cliente_trae_prenda: boolean;
  minutos_produccion: number;
  cantidad: number;
  costo_fijo: number;
  insumos: CotizacionItemInsumoInput[];
}

export interface TrabajoInput {
  requiere_diseno: boolean;
  diseno_por_valor: boolean;
  valor_diseno: number;
  minutos_diseno: number;
  margen_esperado: number;
  descuento_porcentaje: number;
  items: CotizacionItemInput[];
}

export interface DesgloseCosto {
  costo_prenda: number;
  costo_tinta: number;
  costo_papel: number;
  costo_cinta: number;
  costo_empaque: number;
  costo_produccion: number;
  depreciacion: number;
  costo_fijo: number;
}

export interface CotizacionItemResultado {
  descripcion_producto: string;
  cantidad: number;
  costo_directo_unitario: number;
  precio_unitario_sugerido: number;
  subtotal_costo: number;
  subtotal_precio: number;
  ganancia_estimada: number;
  desglose: DesgloseCosto;
}

export interface TrabajoResultado {
  costo_diseno: number;
  precio_diseno: number;
  items: CotizacionItemResultado[];
}

export interface CotizacionCalculoResponse {
  total_costo: number;
  total_precio: number;
  ganancia_total: number;
  trabajos: TrabajoResultado[];
}

export interface CotizacionItemEditable {
  descripcion_producto: string;
  cliente_trae_prenda: boolean;
  minutos_produccion: number;
  cantidad: number;
  costo_fijo: number;
  insumos: CotizacionItemInsumoInput[];
}

export interface TrabajoErp {
  requiere_diseno: boolean;
  diseno_por_valor: boolean;
  valor_diseno: number;
  minutos_diseno: number;
  margen_esperado: number;
  descuento_porcentaje: number;
  costo_diseno: number;
  precio_diseno: number;
  diseno_en_items: boolean;
  items: CotizacionItemResultado[];
  itemsEdicion: CotizacionItemEditable[];
}

export interface CreateCotizacionDto {
  cliente_nombre: string;
  cliente_contacto: string;
  trabajos: TrabajoInput[];
}

export function cotizacionEsEditable(estado: EstadoCotizacion): boolean {
  return estado === "borrador" || estado === "rechazada";
}

export interface CotizacionErp {
  id: number;
  cliente_nombre: string;
  cliente_contacto: string;
  fecha: string;
  total_costo: number;
  total_precio: number;
  estado: EstadoCotizacion;
  trabajos?: TrabajoErp[];
}
