import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ErpInsumo } from '../../../database/entities/erp-insumo.entity';
import { ErpInsumoRepository } from '../domain/erp-insumo.repository';

const RELATIONS = { categoria: true, proveedor: true } as const;

@Injectable()
export class ErpInsumoTypeOrmRepository implements ErpInsumoRepository {
  constructor(
    @InjectRepository(ErpInsumo)
    private readonly typeOrmRepository: Repository<ErpInsumo>,
  ) {}

  async create(insumo: ErpInsumo): Promise<ErpInsumo> {
    const saved = await this.typeOrmRepository.save(
      this.typeOrmRepository.create(insumo),
    );
    const full = await this.findById(String(saved.id));
    if (!full) {
      throw new Error('Insumo no encontrado después de crear');
    }
    return full;
  }

  async findAll(): Promise<ErpInsumo[]> {
    return this.typeOrmRepository.find({
      relations: RELATIONS,
      order: { id: 'ASC' },
    });
  }

  async findById(id: string): Promise<ErpInsumo | null> {
    return this.typeOrmRepository.findOne({
      where: { id: Number(id) },
      relations: RELATIONS,
    });
  }

  async findByIds(ids: number[]): Promise<ErpInsumo[]> {
    if (ids.length === 0) {
      return [];
    }
    return this.typeOrmRepository.find({ where: { id: In(ids) } });
  }

  async update(id: string, insumo: Partial<ErpInsumo>): Promise<ErpInsumo> {
    await this.typeOrmRepository.update({ id: Number(id) }, insumo);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('Insumo no encontrado después de actualizar');
    }
    return updated;
  }
}
