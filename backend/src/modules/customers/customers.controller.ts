import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { CreateCustomerUseCase } from './application/create-customer.usecase';
import { ListCustomersUseCase } from './application/list-customers.usecase';
import { GetCustomerByIdUseCase } from './application/get-customer-by-id.usecase';
import { GetCustomerByUserIdUseCase } from './application/get-customer-by-user-id.usecase';
import { UpdateCustomerUseCase } from './application/update-customer.usecase';
import { CreateCustomerDto } from './application/dto/create-customer.dto';
import { UpdateCustomerDto } from './application/dto/update-customer.dto';
import { Public } from '../auth/infrastructure/decorators/public.decorator';
import { CurrentUser } from '../auth/infrastructure/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/infrastructure/guards/jwt-auth.guard';
import { HttpResponse } from '../../common/http/http-response';

@Controller('customers')
export class CustomersController {
  constructor(
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly listCustomersUseCase: ListCustomersUseCase,
    private readonly getCustomerByIdUseCase: GetCustomerByIdUseCase,
    private readonly getCustomerByUserIdUseCase: GetCustomerByUserIdUseCase,
    private readonly updateCustomerUseCase: UpdateCustomerUseCase,
  ) {}
  
  @Public()
  @Post()
  async create(@Body() customerData: CreateCustomerDto) {
    const customer = await this.createCustomerUseCase.execute(customerData);
    return HttpResponse.created(customer, 'Cliente creado exitosamente');
  }

  @Get()
  async findAll() {
    const customers = await this.listCustomersUseCase.execute();
    return HttpResponse.ok(customers, 'Clientes obtenidos exitosamente');
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-user')
  async findByUserId(@CurrentUser() user: { userId: number; email: string }) {
    const customer = await this.getCustomerByUserIdUseCase.execute(user.userId);
    if (!customer) {
      return HttpResponse.ok(null, 'Cliente no encontrado para este usuario');
    }
    return HttpResponse.ok(customer, 'Cliente obtenido exitosamente');
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const customer = await this.getCustomerByIdUseCase.execute(id);
    return HttpResponse.ok(customer, 'Cliente obtenido exitosamente');
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() customerData: UpdateCustomerDto) {
    const customer = await this.updateCustomerUseCase.execute(id, customerData);
    return HttpResponse.ok(customer, 'Cliente actualizado exitosamente');
  }
}
