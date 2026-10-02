import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import type { ErpInsumoRepository } from '../../erp-insumos/domain/erp-insumo.repository';
import { ERP_INSUMO_REPOSITORY } from '../../erp-insumos/domain/erp-insumo.repository';
import type { ErpParametroRepository } from '../../erp-parametros/domain/erp-parametro.repository';
import { ERP_PARAMETRO_REPOSITORY } from '../../erp-parametros/domain/erp-parametro.repository';
import { ErpInsumo } from '../../../database/entities/erp-insumo.entity';
import {
  calcularCotizacion,
  CosteoError,
  CotizacionCalculada,
  ItemCosteoInput,
  TrabajoCosteoInput,
} from '../domain/costeo';
import { CotizacionItemDto } from './dto/cotizacion-item.dto';
import { CotizacionTrabajoDto } from './dto/cotizacion-trabajo.dto';

@Injectable()
export class CalcularCotizacionUseCase {
  constructor(
    @Inject(ERP_INSUMO_REPOSITORY)
    private readonly insumoRepository: ErpInsumoRepository,
    @Inject(ERP_PARAMETRO_REPOSITORY)
    private readonly parametroRepository: ErpParametroRepository,
  ) {}

  async execute(
    trabajos: CotizacionTrabajoDto[],
  ): Promise<CotizacionCalculada> {
    try {
      const parametros = await this.parametroRepository.findOne();
      if (!parametros) {
        throw new BadRequestException(
          'No hay parámetros de costeo. Ejecuta las migraciones del ERP.',
        );
      }

      const ids = [
        ...new Set(
          trabajos.flatMap((trabajo) =>
            trabajo.items.flatMap((item) =>
              item.insumos.map((line) => line.insumo_id),
            ),
          ),
        ),
      ];
      const insumos = await this.insumoRepository.findByIds(ids);
      const insumosPorId = new Map(
        insumos.map((insumo) => [insumo.id, insumo]),
      );
      const missing = ids.filter((id) => !insumosPorId.has(id));
      if (missing.length > 0) {
        throw new BadRequestException(
          `Insumos no encontrados: ${missing.join(', ')}`,
        );
      }

      return calcularCotizacion(
        trabajos.map((trabajo) => this.toTrabajo(trabajo, insumosPorId)),
        {
          costo_minuto: parametros.costo_minuto,
          depreciacion_por_prenda: parametros.depreciacion_por_prenda,
          costo_fijo_min: parametros.costo_fijo_min,
          costo_fijo_max: parametros.costo_fijo_max,
        },
      );
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error instanceof CosteoError) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException('Error al calcular la cotización');
    }
  }

  private toTrabajo(
    trabajo: CotizacionTrabajoDto,
    insumosPorId: Map<number, ErpInsumo>,
  ): TrabajoCosteoInput {
    return {
      requiere_diseno: trabajo.requiere_diseno,
      diseno_por_valor: trabajo.diseno_por_valor,
      valor_diseno: trabajo.valor_diseno,
      minutos_diseno: trabajo.minutos_diseno,
      margen_esperado: trabajo.margen_esperado,
      descuento_porcentaje: trabajo.descuento_porcentaje,
      items: trabajo.items.map((item) => this.toItem(item, insumosPorId)),
    };
  }

  private toItem(
    item: CotizacionItemDto,
    insumosPorId: Map<number, ErpInsumo>,
  ): ItemCosteoInput {
    return {
      descripcion_producto: item.descripcion_producto,
      cliente_trae_prenda: item.cliente_trae_prenda,
      cantidad: item.cantidad,
      minutos_produccion: item.minutos_produccion,
      costo_fijo: item.costo_fijo,
      insumos: item.insumos.map((line) => ({
        insumo_id: line.insumo_id,
        rol: line.rol,
        cantidad_usada: line.cantidad_usada,
        costo_unitario: insumosPorId.get(line.insumo_id)!.costo_unitario,
      })),
    };
  }
}
