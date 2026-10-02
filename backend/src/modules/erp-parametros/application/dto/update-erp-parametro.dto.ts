import { IsBoolean, IsNumber, Min } from 'class-validator';

export class UpdateErpParametroDto {
  @IsNumber()
  @Min(0)
  costo_minuto: number;

  @IsNumber()
  @Min(0)
  depreciacion_por_prenda: number;

  @IsNumber()
  @Min(0)
  costo_fijo_min: number;

  @IsNumber()
  @Min(0)
  costo_fijo_max: number;

  @IsNumber()
  @Min(0)
  costo_fijo_default: number;

  @IsNumber()
  @Min(0)
  smlmv_base: number;

  @IsNumber()
  @Min(0)
  auxilio_transporte: number;

  @IsNumber()
  @Min(0.01)
  horas_mes: number;

  @IsNumber()
  @Min(0)
  porcentaje_prestaciones: number;

  @IsBoolean()
  calculo_manual: boolean;
}
