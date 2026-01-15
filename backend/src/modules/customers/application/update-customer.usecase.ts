import {
  Injectable,
  Inject,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import type { CustomerRepository } from '../domain/customer.repository';
import { CUSTOMER_REPOSITORY } from '../domain/customer.repository';
import { Customer } from '../../../database/entities/customer.entity';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class UpdateCustomerUseCase {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepository,
  ) {}

  async execute(
    id: string,
    customerData: UpdateCustomerDto,
  ): Promise<Customer> {
    try {
      const existingCustomer = await this.customerRepository.findById(id);
      if (!existingCustomer) {
        throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
      }

      return await this.customerRepository.update(
        id,
        customerData as Partial<Customer>,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al actualizar el cliente');
    }
  }
}
