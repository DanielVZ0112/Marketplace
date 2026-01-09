import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { CreateCategoryUseCase } from './application/create-category.usecase';
import { ListCategoriesUseCase } from './application/list-categories.usecase';
import { GetCategoryByIdUseCase } from './application/get-category-by-id.usecase';
import { UpdateCategoryUseCase } from './application/update-category.usecase';
import { CreateCategoryDto } from './application/dto/create-category.dto';
import { UpdateCategoryDto } from './application/dto/update-category.dto';
import { Public } from '../auth/infrastructure/decorators/public.decorator';
import { HttpResponse } from '../../common/http/http-response';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly listCategoriesUseCase: ListCategoriesUseCase,
    private readonly getCategoryByIdUseCase: GetCategoryByIdUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
  ) {}

  @Post()
  async create(@Body() categoryData: CreateCategoryDto) {
    const category = await this.createCategoryUseCase.execute(categoryData);
    return HttpResponse.created(category, 'Categoría creada exitosamente');
  }

  @Public()
  @Get()
  async findAll() {
    const categories = await this.listCategoriesUseCase.execute();
    return HttpResponse.ok(categories, 'Categorías obtenidas exitosamente');
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const category = await this.getCategoryByIdUseCase.execute(id);
    return HttpResponse.ok(category, 'Categoría obtenida exitosamente');
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() categoryData: UpdateCategoryDto) {
    const category = await this.updateCategoryUseCase.execute(id, categoryData);
    return HttpResponse.ok(category, 'Categoría actualizada exitosamente');
  }
}
