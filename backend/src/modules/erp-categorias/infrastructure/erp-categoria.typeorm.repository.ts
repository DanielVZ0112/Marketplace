import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErpCategoria } from '../../../database/entities/erp-categoria.entity';
import { ErpCategoriaRepository } from '../domain/erp-categoria.repository';

@Injectable()
export class ErpCategoriaTypeOrmRepository implements ErpCategoriaRepository {
  constructor(
    @InjectRepository(ErpCategoria)
    private readonly typeOrmRepository: Repository<ErpCategoria>,
  ) {}

  async create(categoria: ErpCategoria): Promise<ErpCategoria> {
    return this.typeOrmRepository.save(
      this.typeOrmRepository.create(categoria),
    );
  }

  async findAll(): Promise<ErpCategoria[]> {
    return this.typeOrmRepository.find({ order: { nombre: 'ASC' } });
  }

  async findById(id: number): Promise<ErpCategoria | null> {
    return this.typeOrmRepository.findOne({ where: { id } });
  }
}
