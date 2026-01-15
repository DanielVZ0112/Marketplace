import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { User } from '../entities/user.entity';
import { Seeder } from './seed.interface';

@Injectable()
export class CustomersSeeder implements Seeder {
  constructor(private dataSource: DataSource) {}

  async run() {
    const customerRepo = this.dataSource.getRepository(Customer);
    const userRepo = this.dataSource.getRepository(User);

    // Obtener los usuarios creados
    const user1 = await userRepo.findOne({
      where: { email: 'juan.perez@example.com' },
    });
    const user2 = await userRepo.findOne({
      where: { email: 'maria.garcia@example.com' },
    });
    const user3 = await userRepo.findOne({
      where: { email: 'carlos.rodriguez@example.com' },
    });

    if (!user1 || !user2 || !user3) {
      throw new Error('Users must be seeded before customers');
    }

    const customers = [
      {
        first_name: 'Juan',
        last_name: 'Pérez',
        document_number: '12345678A',
        birth_date: new Date('1990-05-15'),
        phone: '+34 600 123 456',
        email: 'juan.perez@example.com',
        address: 'Calle Mayor 123',
        city: 'Madrid',
        country: 'España',
        user_id: user1.id,
      },
      {
        first_name: 'María',
        last_name: 'García',
        document_number: '87654321B',
        birth_date: new Date('1992-08-22'),
        phone: '+34 600 234 567',
        email: 'maria.garcia@example.com',
        address: 'Avenida del Sol 45',
        city: 'Barcelona',
        country: 'España',
        user_id: user2.id,
      },
      {
        first_name: 'Carlos',
        last_name: 'Rodríguez',
        document_number: '11223344C',
        birth_date: new Date('1988-12-10'),
        phone: '+34 600 345 678',
        email: 'carlos.rodriguez@example.com',
        address: 'Plaza Central 78',
        city: 'Valencia',
        country: 'España',
        user_id: user3.id,
      },
    ];

    for (const customerData of customers) {
      const exists = await customerRepo.findOne({
        where: { user_id: customerData.user_id },
      });
      if (!exists) {
        await customerRepo.save(customerRepo.create(customerData));
      }
    }

    console.log('✅ Customers seeded');
  }
}
