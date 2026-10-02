import { Body, Controller, Get, Post } from '@nestjs/common';
import { HttpResponse } from '../../common/http/http-response';
import { CreateErpCategoriaUseCase } from './application/create-erp-categoria.usecase';
import { ListErpCategoriasUseCase } from './application/list-erp-categorias.usecase';
import { CreateErpCategoriaDto } from './application/dto/create-erp-categoria.dto';

@Controller('erp/categorias')
export class ErpCategoriasController {
  constructor(
    private readonly createErpCategoriaUseCase: CreateErpCategoriaUseCase,
    private readonly listErpCategoriasUseCase: ListErpCategoriasUseCase,
  ) {}

  @Get()
  async findAll() {
    const categorias = await this.listErpCategoriasUseCase.execute();
    return HttpResponse.ok(categorias, 'Categorías obtenidas exitosamente');
  }

  @Post()
  async create(@Body() dto: CreateErpCategoriaDto) {
    const categoria = await this.createErpCategoriaUseCase.execute(dto);
    return HttpResponse.created(categoria, 'Categoría creada exitosamente');
  }
}
