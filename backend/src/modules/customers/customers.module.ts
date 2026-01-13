import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersController } from './customers.controller';
import { CreateCustomerUseCase } from './application/create-customer.usecase';
import { ListCustomersUseCase } from './application/list-customers.usecase';
import { GetCustomerByIdUseCase } from './application/get-customer-by-id.usecase';
import { GetCustomerByUserIdUseCase } from './application/get-customer-by-user-id.usecase';
import { UpdateCustomerUseCase } from './application/update-customer.usecase';
import { CustomerTypeOrmRepository } from './infrastructure/customer.typeorm.repository';
import { CUSTOMER_REPOSITORY } from './domain/customer.repository';
import { Customer } from '../../database/entities/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customer])],
  controllers: [CustomersController],
  providers: [
    CreateCustomerUseCase,
    ListCustomersUseCase,
    GetCustomerByIdUseCase,
    GetCustomerByUserIdUseCase,
    UpdateCustomerUseCase,
    {
      provide: CUSTOMER_REPOSITORY,
      useClass: CustomerTypeOrmRepository,
    },
  ],
})
export class CustomersModule {}
