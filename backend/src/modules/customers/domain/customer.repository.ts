import { Customer } from '../../../database/entities/customer.entity';

export const CUSTOMER_REPOSITORY = Symbol('CustomerRepository');

export interface CustomerRepository {
  create(customer: Customer): Promise<Customer>;
  findAll(): Promise<Customer[]>;
  findById(id: string): Promise<Customer | null>;
  update(id: string, customer: Partial<Customer>): Promise<Customer>;
}
