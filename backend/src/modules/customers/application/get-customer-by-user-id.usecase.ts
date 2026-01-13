import { Injectable, Inject, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import type { CustomerRepository } from '../domain/customer.repository';
import { CUSTOMER_REPOSITORY } from '../domain/customer.repository';
import { Customer } from '../../../database/entities/customer.entity';

@Injectable()
export class GetCustomerByUserIdUseCase {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepository,
  ) {}

  async execute(userId: number): Promise<Customer | null> {
    try {
      const customer = await this.customerRepository.findByUserId(userId);
      return customer;
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener el cliente por user_id');
    }
  }
}
