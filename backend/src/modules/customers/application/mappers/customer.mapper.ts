import { Customer } from '../../../../database/entities/customer.entity';
import { CreateCustomerDto } from '../dto/create-customer.dto';

export class CustomerMapper {
  static toEntity(dto: CreateCustomerDto): Customer {
    const customer = new Customer();
    customer.first_name = dto.first_name;
    customer.last_name = dto.last_name;
    customer.document_number = dto.document_number ?? '';
    customer.birth_date = dto.birth_date ? new Date(dto.birth_date) : new Date();
    customer.phone = dto.phone ?? '';
    customer.email = dto.email ?? '';
    customer.address = dto.address ?? '';
    customer.city = dto.city ?? '';
    customer.country = dto.country ?? '';
    customer.user_id = dto.user_id ?? 0;
    return customer;
  }
}

