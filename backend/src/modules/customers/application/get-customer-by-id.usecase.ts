import {
  Injectable,
  Inject,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import type { CustomerRepository } from '../domain/customer.repository';
import { CUSTOMER_REPOSITORY } from '../domain/customer.repository';
import { Customer } from '../../../database/entities/customer.entity';

@Injectable()
export class GetCustomerByIdUseCase {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepository,
  ) {}

  async execute(id: string): Promise<Customer> {
    try {
      const customer = await this.customerRepository.findById(id);

      if (!customer) {
        throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
      }

      return customer;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al obtener el cliente');
    }
  }
}
