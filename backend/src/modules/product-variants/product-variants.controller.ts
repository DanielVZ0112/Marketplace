import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { CreateProductVariantUseCase } from './application/create-product-variant.usecase';
import { ListProductVariantsUseCase } from './application/list-product-variants.usecase';
import { GetProductVariantByIdUseCase } from './application/get-product-variant-by-id.usecase';
import { UpdateProductVariantUseCase } from './application/update-product-variant.usecase';
import { CreateProductVariantDto } from './application/dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './application/dto/update-product-variant.dto';
import { Public } from '../auth/infrastructure/decorators/public.decorator';
import { HttpResponse } from '../../common/http/http-response';

@Controller('product-variants')
export class ProductVariantsController {
  constructor(
    private readonly createProductVariantUseCase: CreateProductVariantUseCase,
    private readonly listProductVariantsUseCase: ListProductVariantsUseCase,
    private readonly getProductVariantByIdUseCase: GetProductVariantByIdUseCase,
    private readonly updateProductVariantUseCase: UpdateProductVariantUseCase,
  ) {}

  @Post()
  async create(@Body() variantData: CreateProductVariantDto) {
    const variant = await this.createProductVariantUseCase.execute(variantData);
    return HttpResponse.created(
      variant,
      'Variante de producto creada exitosamente',
    );
  }

  @Public()
  @Get()
  async findAll() {
    const variants = await this.listProductVariantsUseCase.execute();
    return HttpResponse.ok(
      variants,
      'Variantes de productos obtenidas exitosamente',
    );
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const variant = await this.getProductVariantByIdUseCase.execute(id);
    return HttpResponse.ok(
      variant,
      'Variante de producto obtenida exitosamente',
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() variantData: UpdateProductVariantDto,
  ) {
    const variant = await this.updateProductVariantUseCase.execute(
      id,
      variantData,
    );
    return HttpResponse.ok(
      variant,
      'Variante de producto actualizada exitosamente',
    );
  }
}
