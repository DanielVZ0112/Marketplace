import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ErpCotizacion } from '../../../database/entities/erp-cotizacion.entity';
import { ErpCotizacionTrabajo } from '../../../database/entities/erp-cotizacion-trabajo.entity';
import { ErpCotizacionRepository } from '../domain/erp-cotizacion.repository';

const DETAIL_RELATIONS = {
  trabajos: { items: { insumos: { insumo: true } } },
} as const;

const DETAIL_ORDER = {
  trabajos: {
    orden: 'ASC' as const,
    items: { id: 'ASC' as const, insumos: { id: 'ASC' as const } },
  },
};

@Injectable()
export class ErpCotizacionTypeOrmRepository implements ErpCotizacionRepository {
  constructor(
    @InjectRepository(ErpCotizacion)
    private readonly typeOrmRepository: Repository<ErpCotizacion>,
    private readonly dataSource: DataSource,
  ) {}

  async create(cotizacion: ErpCotizacion): Promise<ErpCotizacion> {
    return this.dataSource.transaction(async (manager) => {
      const saved = await manager.save(ErpCotizacion, cotizacion);
      const full = await manager.findOne(ErpCotizacion, {
        where: { id: saved.id },
        relations: DETAIL_RELATIONS,
        order: DETAIL_ORDER,
      });
      if (!full) {
        throw new Error('No se pudo recuperar la cotización creada');
      }
      return full;
    });
  }

  async findAll(): Promise<ErpCotizacion[]> {
    return this.typeOrmRepository.find({ order: { id: 'DESC' } });
  }

  async findById(id: string): Promise<ErpCotizacion | null> {
    return this.typeOrmRepository.findOne({
      where: { id: Number(id) },
      relations: DETAIL_RELATIONS,
      order: DETAIL_ORDER,
    });
  }

  async update(cotizacion: ErpCotizacion): Promise<ErpCotizacion> {
    return this.dataSource.transaction(async (manager) => {
      await manager.delete(ErpCotizacionTrabajo, {
        cotizacion_id: cotizacion.id,
      });
      await manager.save(ErpCotizacion, cotizacion);
      const full = await manager.findOne(ErpCotizacion, {
        where: { id: cotizacion.id },
        relations: DETAIL_RELATIONS,
        order: DETAIL_ORDER,
      });
      if (!full) {
        throw new Error('No se pudo recuperar la cotización actualizada');
      }
      return full;
    });
  }

  async updateEstado(
    id: string,
    estado: string,
  ): Promise<ErpCotizacion | null> {
    const existing = await this.findById(id);
    if (!existing) {
      return null;
    }
    await this.typeOrmRepository.update(Number(id), { estado });
    existing.estado = estado;
    return existing;
  }
}
