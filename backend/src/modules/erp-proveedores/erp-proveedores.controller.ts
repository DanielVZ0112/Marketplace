import { Body, Controller, Get, Post } from '@nestjs/common';
import { HttpResponse } from '../../common/http/http-response';
import { CreateErpProveedorUseCase } from './application/create-erp-proveedor.usecase';
import { ListErpProveedoresUseCase } from './application/list-erp-proveedores.usecase';
import { CreateErpProveedorDto } from './application/dto/create-erp-proveedor.dto';

@Controller('erp/proveedores')
export class ErpProveedoresController {
  constructor(
    private readonly createErpProveedorUseCase: CreateErpProveedorUseCase,
    private readonly listErpProveedoresUseCase: ListErpProveedoresUseCase,
  ) {}

  @Get()
  async findAll() {
    const proveedores = await this.listErpProveedoresUseCase.execute();
    return HttpResponse.ok(proveedores, 'Proveedores obtenidos exitosamente');
  }

  @Post()
  async create(@Body() dto: CreateErpProveedorDto) {
    const proveedor = await this.createErpProveedorUseCase.execute(dto);
    return HttpResponse.created(proveedor, 'Proveedor creado exitosamente');
  }
}
