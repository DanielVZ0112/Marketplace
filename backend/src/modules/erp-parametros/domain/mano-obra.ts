export interface ManoObraInput {
  smlmv_base: number;
  auxilio_transporte: number;
  horas_mes: number;
  porcentaje_prestaciones: number;
}

export interface ManoObraResultado {
  costo_mensual: number;
  costo_hora: number;
  costo_minuto: number;
  costo_dia: number;
}

function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calcularManoObra(input: ManoObraInput): ManoObraResultado {
  if (input.horas_mes <= 0) {
    throw new Error('Las horas al mes deben ser mayores a 0');
  }
  const costoMensual = roundMoney(
    input.smlmv_base * (1 + input.porcentaje_prestaciones / 100) +
      input.auxilio_transporte,
  );
  const costoHora = roundMoney(costoMensual / input.horas_mes);
  return {
    costo_mensual: costoMensual,
    costo_hora: costoHora,
    costo_minuto: roundMoney(costoHora / 60),
    costo_dia: roundMoney(costoMensual / 30),
  };
}
