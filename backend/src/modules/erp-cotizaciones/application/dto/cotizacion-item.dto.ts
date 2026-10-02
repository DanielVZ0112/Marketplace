import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { InsumoRol } from '../../../../common/enums/insumo-rol.enum';

export class CotizacionItemInsumoDto {
  @IsInt()
  @Min(1)
  insumo_id: number;

  @IsEnum(InsumoRol)
  rol: InsumoRol;

  @IsNumber()
  @Min(0)
  cantidad_usada: number;
}

export class CotizacionItemDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  descripcion_producto: string;

  @IsBoolean()
  cliente_trae_prenda: boolean;

  @IsInt()
  @Min(1)
  cantidad: number;

  @IsNumber()
  @Min(0)
  minutos_produccion: number;

  @IsNumber()
  @Min(0)
  costo_fijo: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CotizacionItemInsumoDto)
  insumos: CotizacionItemInsumoDto[];
}
