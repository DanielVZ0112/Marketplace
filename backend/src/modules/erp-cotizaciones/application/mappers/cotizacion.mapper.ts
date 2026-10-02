import { CotizacionEstado } from '../../../../common/enums/cotizacion-estado.enum';
import { ErpCotizacion } from '../../../../database/entities/erp-cotizacion.entity';
import { ErpCotizacionItem } from '../../../../database/entities/erp-cotizacion-item.entity';
import { ErpCotizacionItemInsumo } from '../../../../database/entities/erp-cotizacion-item-insumo.entity';
import { ErpCotizacionTrabajo } from '../../../../database/entities/erp-cotizacion-trabajo.entity';
import { CotizacionCalculada } from '../../domain/costeo';
import { CreateCotizacionDto } from '../dto/create-cotizacion.dto';

export class CotizacionMapper {
  static toEntity(
    dto: CreateCotizacionDto,
    calculada: CotizacionCalculada,
  ): ErpCotizacion {
    const cotizacion = new ErpCotizacion();
    cotizacion.cliente_nombre = dto.cliente_nombre;
    cotizacion.cliente_contacto = dto.cliente_contacto;
    cotizacion.fecha = (dto.fecha ?? todayDate()).slice(0, 10);
    cotizacion.total_costo = calculada.total_costo;
    cotizacion.total_precio = calculada.total_precio;
    cotizacion.estado = CotizacionEstado.BORRADOR;
    cotizacion.trabajos = calculada.trabajos.map((trabajo, index) => {
      const entity = new ErpCotizacionTrabajo();
      entity.orden = index + 1;
      entity.requiere_diseno = trabajo.requiere_diseno;
      entity.diseno_por_valor = trabajo.diseno_por_valor;
      entity.valor_diseno = trabajo.valor_diseno;
      entity.minutos_diseno = trabajo.minutos_diseno;
      entity.margen_esperado = trabajo.margen_esperado;
      entity.descuento_porcentaje = trabajo.descuento_porcentaje;
      entity.costo_minuto = trabajo.costo_minuto;
      entity.costo_diseno = trabajo.costo_diseno;
      entity.precio_diseno = trabajo.precio_diseno;
      entity.diseno_en_items = false;
      entity.cotizacion = cotizacion;
      entity.items = trabajo.items.map((item) => {
        const itemEntity = new ErpCotizacionItem();
        itemEntity.descripcion_producto = item.descripcion_producto;
        itemEntity.cliente_trae_prenda = item.cliente_trae_prenda;
        itemEntity.cantidad = item.cantidad;
        itemEntity.minutos_produccion = item.minutos_produccion;
        itemEntity.costo_minuto = item.costo_minuto;
        itemEntity.depreciacion = item.depreciacion;
        itemEntity.costo_fijo = item.costo_fijo;
        itemEntity.costo_prenda = item.costo_prenda;
        itemEntity.costo_tinta = item.costo_tinta;
        itemEntity.costo_papel = item.costo_papel;
        itemEntity.costo_cinta = item.costo_cinta;
        itemEntity.costo_empaque = item.costo_empaque;
        itemEntity.costo_unitario = item.costo_unitario;
        itemEntity.precio_unitario = item.precio_unitario;
        itemEntity.subtotal = item.subtotal;
        itemEntity.cotizacion = cotizacion;
        itemEntity.trabajo = entity;
        itemEntity.insumos = item.insumos.map((line) => {
          const insumo = new ErpCotizacionItemInsumo();
          insumo.insumo_id = line.insumo_id;
          insumo.rol = line.rol;
          insumo.cantidad_usada = line.cantidad_usada;
          insumo.costo_unitario_snapshot = line.costo_unitario_snapshot;
          insumo.costo_linea = line.costo_linea;
          insumo.item = itemEntity;
          return insumo;
        });
        return itemEntity;
      });
      return entity;
    });
    return cotizacion;
  }

  static toReplacement(
    existing: ErpCotizacion,
    dto: CreateCotizacionDto,
    calculada: CotizacionCalculada,
  ): ErpCotizacion {
    const cotizacion = this.toEntity(dto, calculada);

    cotizacion.id = existing.id;
    cotizacion.estado = existing.estado;
    cotizacion.fecha = fechaGuardada(existing.fecha);
    cotizacion.created_at = existing.created_at;
    return cotizacion;
  }
}

function fechaGuardada(value: string | Date): string {
  if (value instanceof Date) {
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    return `${value.getFullYear()}-${month}-${day}`;
  }
  return String(value).slice(0, 10);
}

function todayDate(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}
