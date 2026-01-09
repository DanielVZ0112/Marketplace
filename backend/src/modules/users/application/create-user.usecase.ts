import { Injectable, Inject, ConflictException, InternalServerErrorException } from '@nestjs/common';
import type { UserRepository } from '../domain/user.repository';
import { USER_REPOSITORY } from '../domain/user.repository';
import { User } from '../../../database/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserMapper } from './mappers/user.mapper';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userData: CreateUserDto): Promise<User> {
    try {
      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser) {
        throw new ConflictException('El email ya está registrado');
      }

      const user = await UserMapper.toEntity(userData);
      return await this.userRepository.create(user);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al crear el usuario');
    }
  }
}
