import { Customer } from '../../../../database/entities/customer.entity';
import { CreateCustomerDto } from '../dto/create-customer.dto';

export class CustomerMapper {
  static toEntity(dto: CreateCustomerDto): Customer {
    const customer = Object.assign(new Customer(), {
      first_name: dto.first_name,
      last_name: dto.last_name,
      document_number: dto.document_number || undefined,
      birth_date: dto.birth_date ? new Date(dto.birth_date) : undefined,
      phone: dto.phone || undefined,
      email: dto.email || undefined,
      address: dto.address || undefined,
      city: dto.city || undefined,
      country: dto.country || undefined,
      user_id: dto.user_id || undefined,
    } as Partial<Customer>);
    return customer;
  }
}
