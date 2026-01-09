import { Injectable, Inject, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { UserRepository } from '../domain/user.repository';
import { USER_REPOSITORY } from '../domain/user.repository';
import { User } from '../../../database/entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string, userData: UpdateUserDto): Promise<User> {
    try {
      const existingUser = await this.userRepository.findById(id);
      if (!existingUser) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }

      if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, 10);
      }

      return await this.userRepository.update(id, userData);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al actualizar el usuario');
    }
  }
}

