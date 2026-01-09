import { Injectable, Inject, InternalServerErrorException } from '@nestjs/common';
import type { UserRepository } from '../domain/user.repository';
import { USER_REPOSITORY } from '../domain/user.repository';
import { User } from '../../../database/entities/user.entity';

@Injectable()
export class ListUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(): Promise<User[]> {
    try {
      return await this.userRepository.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Error al listar los usuarios');
    }
  }
}
