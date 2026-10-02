import type { ErpCategoria, ErpProveedor } from "./CatalogoErp";

export type UnidadMedida = "ml" | "hoja" | "unidad" | "uso";

export interface InsumoErp {
  id: number;
  nombre: string;
  unidad_medida: UnidadMedida;
  costo_unitario: number;
  stock_actual: number;
  stock_minimo: number;
  categoria_id: number;
  proveedor_id: number | null;
  categoria?: ErpCategoria | null;
  proveedor?: ErpProveedor | null;
}

export interface InsumoErpInput {
  nombre: string;
  unidad_medida: UnidadMedida;
  costo_unitario: number;
  stock_actual: number;
  stock_minimo: number;
  categoria_id: number;
  proveedor_id: number | null;
}
