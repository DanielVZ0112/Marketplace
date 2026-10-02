import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ErpCategoria } from '../../../database/entities/erp-categoria.entity';
import type { ErpCategoriaRepository } from '../domain/erp-categoria.repository';
import { ERP_CATEGORIA_REPOSITORY } from '../domain/erp-categoria.repository';

@Injectable()
export class ListErpCategoriasUseCase {
  constructor(
    @Inject(ERP_CATEGORIA_REPOSITORY)
    private readonly categoriaRepository: ErpCategoriaRepository,
  ) {}

  async execute(): Promise<ErpCategoria[]> {
    try {
      return await this.categoriaRepository.findAll();
    } catch {
      throw new InternalServerErrorException('Error al listar las categorías');
    }
  }
}
