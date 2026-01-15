import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { CreateUserUseCase } from './application/create-user.usecase';
import { ListUsersUseCase } from './application/list-users.usecase';
import { GetUserByIdUseCase } from './application/get-user-by-id.usecase';
import { UpdateUserUseCase } from './application/update-user.usecase';
import { CreateUserDto } from './application/dto/create-user.dto';
import { UpdateUserDto } from './application/dto/update-user.dto';
import { Public } from '../auth/infrastructure/decorators/public.decorator';
import { HttpResponse } from '../../common/http/http-response';

@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
  ) {}

  @Public()
  @Post()
  async create(@Body() userData: CreateUserDto) {
    const user = await this.createUserUseCase.execute(userData);
    return HttpResponse.created(user, 'Usuario creado exitosamente');
  }

  @Get()
  async findAll() {
    const users = await this.listUsersUseCase.execute();
    return HttpResponse.ok(users, 'Usuarios obtenidos exitosamente');
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.getUserByIdUseCase.execute(id);
    return HttpResponse.ok(user, 'Usuario obtenido exitosamente');
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() userData: UpdateUserDto) {
    const user = await this.updateUserUseCase.execute(id, userData);
    return HttpResponse.ok(user, 'Usuario actualizado exitosamente');
  }
}
