import { ErpInsumo } from '../../../../database/entities/erp-insumo.entity';
import { CreateErpInsumoDto } from '../dto/create-erp-insumo.dto';

export class ErpInsumoMapper {
  static toEntity(dto: CreateErpInsumoDto): ErpInsumo {
    const insumo = new ErpInsumo();
    insumo.nombre = dto.nombre;
    insumo.unidad_medida = dto.unidad_medida;
    insumo.costo_unitario = dto.costo_unitario;
    insumo.stock_actual = dto.stock_actual;
    insumo.stock_minimo = dto.stock_minimo;
    insumo.categoria_id = dto.categoria_id;
    insumo.proveedor_id = dto.proveedor_id ?? null;
    return insumo;
  }
}
