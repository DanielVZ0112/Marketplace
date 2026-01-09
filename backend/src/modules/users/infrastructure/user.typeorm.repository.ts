import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { UserRepository } from '../domain/user.repository';
import { User } from '../../../database/entities/user.entity';

@Injectable()
export class UserTypeOrmRepository implements UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly typeOrmRepository: Repository<User>,
  ) {}

  async create(user: User): Promise<User> {
    const newUser = this.typeOrmRepository.create(user);
    return await this.typeOrmRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return await this.typeOrmRepository.find({
      where: { deleted_at: IsNull() },
      relations: ['customer'],
    });
  }

  async findById(id: string): Promise<User | null> {
    return await this.typeOrmRepository.findOne({
      where: { id: Number(id), deleted_at: IsNull() },
      relations: ['customer'],
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.typeOrmRepository.findOne({
      where: { email, deleted_at: IsNull() },
      relations: ['customer'],
    });
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    await this.typeOrmRepository.update(
      { id: Number(id), deleted_at: IsNull() },
      user,
    );
    const updatedUser = await this.findById(id);
    if (!updatedUser) {
      throw new Error('User not found after update');
    }
    return updatedUser;
  }
}
