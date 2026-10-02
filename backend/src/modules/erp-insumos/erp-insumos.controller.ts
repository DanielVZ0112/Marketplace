import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { HttpResponse } from '../../common/http/http-response';
import { CreateErpInsumoUseCase } from './application/create-erp-insumo.usecase';
import { ListErpInsumosUseCase } from './application/list-erp-insumos.usecase';
import { GetErpInsumoByIdUseCase } from './application/get-erp-insumo-by-id.usecase';
import { UpdateErpInsumoUseCase } from './application/update-erp-insumo.usecase';
import { CreateErpInsumoDto } from './application/dto/create-erp-insumo.dto';
import { UpdateErpInsumoDto } from './application/dto/update-erp-insumo.dto';

@Controller('erp/insumos')
export class ErpInsumosController {
  constructor(
    private readonly createErpInsumoUseCase: CreateErpInsumoUseCase,
    private readonly listErpInsumosUseCase: ListErpInsumosUseCase,
    private readonly getErpInsumoByIdUseCase: GetErpInsumoByIdUseCase,
    private readonly updateErpInsumoUseCase: UpdateErpInsumoUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateErpInsumoDto) {
    const insumo = await this.createErpInsumoUseCase.execute(dto);
    return HttpResponse.created(insumo, 'Insumo creado exitosamente');
  }

  @Get()
  async findAll() {
    const insumos = await this.listErpInsumosUseCase.execute();
    return HttpResponse.ok(insumos, 'Insumos obtenidos exitosamente');
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const insumo = await this.getErpInsumoByIdUseCase.execute(id);
    return HttpResponse.ok(insumo, 'Insumo obtenido exitosamente');
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateErpInsumoDto) {
    const insumo = await this.updateErpInsumoUseCase.execute(id, dto);
    return HttpResponse.ok(insumo, 'Insumo actualizado exitosamente');
  }
}
