import type { DesgloseCosto, EstadoCotizacion, InsumoRol } from "../domain/CotizacionErp";
import type { UnidadMedida } from "../domain/InsumoErp";

export function formatCop(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 2,
  }).format(value);
}

export function textoDesglose(desglose: DesgloseCosto, disenoAparte = true): string {
  const prefijo = disenoAparte
    ? "Por pieza, sin diseño"
    : "Rubros por pieza. El diseño de esta cotización sigue dentro del costo unitario";
  return `${prefijo}: prenda ${formatCop(desglose.costo_prenda)} · tinta ${formatCop(desglose.costo_tinta)} · papel ${formatCop(desglose.costo_papel)} · cinta ${formatCop(desglose.costo_cinta)} · empaque ${formatCop(desglose.costo_empaque)} · prensa ${formatCop(desglose.costo_produccion)} · depreciación ${formatCop(desglose.depreciacion)} · fijo ${formatCop(desglose.costo_fijo)}.`;
}

export const ESTADO_LABEL: Record<EstadoCotizacion, string> = {
  borrador: "Borrador",
  enviada: "Enviada",
  aprobada: "Aprobada",
  rechazada: "Rechazada",
};

export const UNIDAD_LABEL: Record<UnidadMedida, string> = {
  ml: "ml",
  hoja: "hoja",
  unidad: "unidad",
  uso: "uso",
};

export const ROL_LABEL: Record<InsumoRol, string> = {
  prenda: "Prenda",
  tinta: "Tinta",
  papel: "Papel",
  cinta: "Cinta",
  empaque: "Empaque",
};
