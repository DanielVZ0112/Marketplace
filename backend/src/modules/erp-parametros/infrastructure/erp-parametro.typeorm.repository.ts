import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErpParametro } from '../../../database/entities/erp-parametro.entity';
import { ErpParametroRepository } from '../domain/erp-parametro.repository';

@Injectable()
export class ErpParametroTypeOrmRepository implements ErpParametroRepository {
  constructor(
    @InjectRepository(ErpParametro)
    private readonly typeOrmRepository: Repository<ErpParametro>,
  ) {}

  async findOne(): Promise<ErpParametro | null> {
    const [parametro] = await this.typeOrmRepository.find({
      order: { id: 'ASC' },
      take: 1,
    });
    return parametro ?? null;
  }

  async update(id: number, data: Partial<ErpParametro>): Promise<ErpParametro> {
    await this.typeOrmRepository.update(id, data);
    const updated = await this.typeOrmRepository.findOne({ where: { id } });
    if (!updated) {
      throw new Error('Parámetros no encontrados después de actualizar');
    }
    return updated;
  }
}
