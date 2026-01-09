import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { CreateUserUseCase } from './application/create-user.usecase';
import { ListUsersUseCase } from './application/list-users.usecase';
import { GetUserByIdUseCase } from './application/get-user-by-id.usecase';
import { UpdateUserUseCase } from './application/update-user.usecase';
import { UserTypeOrmRepository } from './infrastructure/user.typeorm.repository';
import { USER_REPOSITORY } from './domain/user.repository';
import { User } from '../../database/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    CreateUserUseCase,
    ListUsersUseCase,
    GetUserByIdUseCase,
    UpdateUserUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: UserTypeOrmRepository,
    },
  ],
  exports: [USER_REPOSITORY], 
})
export class UsersModule {}
