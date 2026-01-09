import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { CustomerRepository } from '../domain/customer.repository';
import { Customer } from '../../../database/entities/customer.entity';

@Injectable()
export class CustomerTypeOrmRepository implements CustomerRepository {
  constructor(
    @InjectRepository(Customer)
    private readonly typeOrmRepository: Repository<Customer>,
  ) {}

  async create(customer: Customer): Promise<Customer> {
    const newCustomer = this.typeOrmRepository.create(customer);
    return await this.typeOrmRepository.save(newCustomer);
  }

  async findAll(): Promise<Customer[]> {
    return await this.typeOrmRepository.find({
      where: { deleted_at: IsNull() },
      relations: ['user'],
    });
  }

  async findById(id: string): Promise<Customer | null> {
    return await this.typeOrmRepository.findOne({
      where: { id: Number(id), deleted_at: IsNull() },
      relations: ['user'],
    });
  }

  async update(id: string, customer: Partial<Customer>): Promise<Customer> {
    await this.typeOrmRepository.update(
      { id: Number(id), deleted_at: IsNull() },
      customer,
    );
    const updatedCustomer = await this.findById(id);
    if (!updatedCustomer) {
      throw new Error('Customer not found after update');
    }
    return updatedCustomer;
  }
}
