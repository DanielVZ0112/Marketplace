import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { CreateProductUseCase } from './application/create-product.usecase';
import { ListProductsUseCase } from './application/list-products.usecase';
import { GetProductByIdUseCase } from './application/get-product-by-id.usecase';
import { UpdateProductUseCase } from './application/update-product.usecase';
import { CreateProductDto } from './application/dto/create-product.dto';
import { UpdateProductDto } from './application/dto/update-product.dto';
import { FilterProductsDto } from './application/dto/filter-products.dto';
import { Public } from '../auth/infrastructure/decorators/public.decorator';
import { HttpResponse } from '../../common/http/http-response';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly listProductsUseCase: ListProductsUseCase,
    private readonly getProductByIdUseCase: GetProductByIdUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
  ) {}

  @Post()
  async create(@Body() productData: CreateProductDto) {
    const product = await this.createProductUseCase.execute(productData);
    return HttpResponse.created(product, 'Producto creado exitosamente');
  }

  @Get()
  @Public()
  async findAll(@Query() filters: FilterProductsDto) {
    const products = await this.listProductsUseCase.execute(filters);
    return HttpResponse.ok(products, 'Productos obtenidos exitosamente');
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string) {
    const product = await this.getProductByIdUseCase.execute(id);
    return HttpResponse.ok(product, 'Producto obtenido exitosamente');
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() productData: UpdateProductDto) {
    const product = await this.updateProductUseCase.execute(id, productData);
    return HttpResponse.ok(product, 'Producto actualizado exitosamente');
  }
}
