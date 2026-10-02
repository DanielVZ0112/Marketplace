import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ErpCategoria } from '../../../database/entities/erp-categoria.entity';
import type { ErpCategoriaRepository } from '../domain/erp-categoria.repository';
import { ERP_CATEGORIA_REPOSITORY } from '../domain/erp-categoria.repository';
import { CreateErpCategoriaDto } from './dto/create-erp-categoria.dto';

@Injectable()
export class CreateErpCategoriaUseCase {
  constructor(
    @Inject(ERP_CATEGORIA_REPOSITORY)
    private readonly categoriaRepository: ErpCategoriaRepository,
  ) {}

  async execute(dto: CreateErpCategoriaDto): Promise<ErpCategoria> {
    try {
      const categoria = new ErpCategoria();
      categoria.nombre = dto.nombre.trim();
      categoria.descripcion = dto.descripcion?.trim() || null;
      return await this.categoriaRepository.create(categoria);
    } catch {
      throw new InternalServerErrorException('Error al crear la categoría');
    }
  }
}
