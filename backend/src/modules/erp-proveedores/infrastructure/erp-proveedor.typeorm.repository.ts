import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErpProveedor } from '../../../database/entities/erp-proveedor.entity';
import { ErpProveedorRepository } from '../domain/erp-proveedor.repository';

@Injectable()
export class ErpProveedorTypeOrmRepository implements ErpProveedorRepository {
  constructor(
    @InjectRepository(ErpProveedor)
    private readonly typeOrmRepository: Repository<ErpProveedor>,
  ) {}

  async create(proveedor: ErpProveedor): Promise<ErpProveedor> {
    return this.typeOrmRepository.save(
      this.typeOrmRepository.create(proveedor),
    );
  }

  async findAll(): Promise<ErpProveedor[]> {
    return this.typeOrmRepository.find({ order: { nombre: 'ASC' } });
  }

  async findById(id: number): Promise<ErpProveedor | null> {
    return this.typeOrmRepository.findOne({ where: { id } });
  }
}
