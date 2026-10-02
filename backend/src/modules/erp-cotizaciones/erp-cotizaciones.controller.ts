import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { HttpResponse } from '../../common/http/http-response';
import { CalcularCotizacionUseCase } from './application/calcular-cotizacion.usecase';
import { CreateCotizacionUseCase } from './application/create-cotizacion.usecase';
import { ListCotizacionesUseCase } from './application/list-cotizaciones.usecase';
import { GetCotizacionByIdUseCase } from './application/get-cotizacion-by-id.usecase';
import { UpdateCotizacionEstadoUseCase } from './application/update-cotizacion-estado.usecase';
import { UpdateCotizacionUseCase } from './application/update-cotizacion.usecase';
import { CalcularCotizacionDto } from './application/dto/calcular-cotizacion.dto';
import { CreateCotizacionDto } from './application/dto/create-cotizacion.dto';
import { UpdateCotizacionEstadoDto } from './application/dto/update-cotizacion-estado.dto';

@Controller('erp/cotizaciones')
export class ErpCotizacionesController {
  constructor(
    private readonly calcularCotizacionUseCase: CalcularCotizacionUseCase,
    private readonly createCotizacionUseCase: CreateCotizacionUseCase,
    private readonly listCotizacionesUseCase: ListCotizacionesUseCase,
    private readonly getCotizacionByIdUseCase: GetCotizacionByIdUseCase,
    private readonly updateCotizacionEstadoUseCase: UpdateCotizacionEstadoUseCase,
    private readonly updateCotizacionUseCase: UpdateCotizacionUseCase,
  ) {}

  @Post('calcular')
  async calcular(@Body() dto: CalcularCotizacionDto) {
    const calculo = await this.calcularCotizacionUseCase.execute(dto.trabajos);
    return HttpResponse.ok(calculo, 'Cotización calculada exitosamente');
  }

  @Post()
  async create(@Body() dto: CreateCotizacionDto) {
    const cotizacion = await this.createCotizacionUseCase.execute(dto);
    return HttpResponse.created(cotizacion, 'Cotización creada exitosamente');
  }

  @Get()
  async findAll() {
    const cotizaciones = await this.listCotizacionesUseCase.execute();
    return HttpResponse.ok(cotizaciones, 'Cotizaciones obtenidas exitosamente');
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: CreateCotizacionDto) {
    const cotizacion = await this.updateCotizacionUseCase.execute(id, dto);
    return HttpResponse.ok(cotizacion, 'Cotización actualizada exitosamente');
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const cotizacion = await this.getCotizacionByIdUseCase.execute(id);
    return HttpResponse.ok(cotizacion, 'Cotización obtenida exitosamente');
  }

  @Patch(':id/estado')
  async updateEstado(
    @Param('id') id: string,
    @Body() dto: UpdateCotizacionEstadoDto,
  ) {
    const cotizacion = await this.updateCotizacionEstadoUseCase.execute(
      id,
      dto,
    );
    return HttpResponse.ok(cotizacion, 'Estado actualizado exitosamente');
  }
}
