import { Injectable, Inject, InternalServerErrorException } from '@nestjs/common';
import type { CustomerRepository } from '../domain/customer.repository';
import { CUSTOMER_REPOSITORY } from '../domain/customer.repository';
import { Customer } from '../../../database/entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerMapper } from './mappers/customer.mapper';

@Injectable()
export class CreateCustomerUseCase {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepository,
  ) {}

  async execute(customerData: CreateCustomerDto): Promise<Customer> {
    try {
      const customer = CustomerMapper.toEntity(customerData);
      return await this.customerRepository.create(customer);
    } catch (error) {
      console.error('Error al crear el cliente:', error);
      throw new InternalServerErrorException(
        error instanceof Error ? error.message : 'Error al crear el cliente'
      );
    }
  }
}
