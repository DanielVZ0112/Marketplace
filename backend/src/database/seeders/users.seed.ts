import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { Seeder } from './seed.interface';

@Injectable()
export class UsersSeeder implements Seeder {
  constructor(private dataSource: DataSource) {}

  async run() {
    const repo = this.dataSource.getRepository(User);

    // Generar hashes de contraseñas
    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = [
      {
        email: 'juan.perez@example.com',
        password: hashedPassword,
        is_active: true,
      },
      {
        email: 'maria.garcia@example.com',
        password: hashedPassword,
        is_active: true,
      },
      {
        email: 'carlos.rodriguez@example.com',
        password: hashedPassword,
        is_active: true,
      },
    ];

    for (const userData of users) {
      const exists = await repo.findOne({ where: { email: userData.email } });
      if (!exists) {
        await repo.save(repo.create(userData));
      }
    }

    console.log('✅ Users seeded');
  }
}
