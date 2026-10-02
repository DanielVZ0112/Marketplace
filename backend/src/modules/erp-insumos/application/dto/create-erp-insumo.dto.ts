import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';
import { UnidadMedida } from '../../../../common/enums/unidad-medida.enum';

export class CreateErpInsumoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombre: string;

  @IsEnum(UnidadMedida)
  unidad_medida: UnidadMedida;

  @IsNumber()
  @Min(0)
  costo_unitario: number;

  @IsNumber()
  @Min(0)
  stock_actual: number;

  @IsNumber()
  @Min(0)
  stock_minimo: number;

  @IsInt()
  @Min(1)
  categoria_id: number;

  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsInt()
  @Min(1)
  proveedor_id?: number | null;
}
