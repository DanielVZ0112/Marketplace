export interface ParametrosErp {
  id: number;
  costo_minuto: number;
  depreciacion_por_prenda: number;
  costo_fijo_min: number;
  costo_fijo_max: number;
  costo_fijo_default: number;
  smlmv_base: number;
  auxilio_transporte: number;
  horas_mes: number;
  porcentaje_prestaciones: number;
  calculo_manual: boolean;
}

export type UpdateParametrosErp = Omit<ParametrosErp, "id">;
