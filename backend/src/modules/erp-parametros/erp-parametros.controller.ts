import { Body, Controller, Get, Put } from '@nestjs/common';
import { HttpResponse } from '../../common/http/http-response';
import { GetErpParametroUseCase } from './application/get-erp-parametro.usecase';
import { UpdateErpParametroUseCase } from './application/update-erp-parametro.usecase';
import { UpdateErpParametroDto } from './application/dto/update-erp-parametro.dto';

@Controller('erp/parametros')
export class ErpParametrosController {
  constructor(
    private readonly getErpParametroUseCase: GetErpParametroUseCase,
    private readonly updateErpParametroUseCase: UpdateErpParametroUseCase,
  ) {}

  @Get()
  async find() {
    const parametro = await this.getErpParametroUseCase.execute();
    return HttpResponse.ok(parametro, 'Parámetros obtenidos exitosamente');
  }

  @Put()
  async update(@Body() dto: UpdateErpParametroDto) {
    const parametro = await this.updateErpParametroUseCase.execute(dto);
    return HttpResponse.ok(parametro, 'Parámetros actualizados exitosamente');
  }
}
