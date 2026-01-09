import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Category } from '../entities/category.entity';
import { Seeder } from './seed.interface';

@Injectable()
export class CategoriesSeeder implements Seeder {
  constructor(private dataSource: DataSource) {}

  async run() {
    const repo = this.dataSource.getRepository(Category);

    const categories = [
      { name: 'Camisetas', slug: 'camisetas' },
      { name: 'Pantalones', slug: 'pantalones' },
      { name: 'Zapatos', slug: 'zapatos' },
      { name: 'Accesorios', slug: 'accesorios' },
      { name: 'Chaquetas', slug: 'chaquetas' },
      { name: 'Vestidos', slug: 'vestidos' },
      { name: 'Ropa Interior', slug: 'ropa-interior' },
      { name: 'Deportes', slug: 'deportes' },
      { name: 'Bolsos', slug: 'bolsos' },
      { name: 'Relojes', slug: 'relojes' },
    ];

    for (const cat of categories) {
      const exists = await repo.findOne({ where: { slug: cat.slug } });
      if (!exists) {
        await repo.save(repo.create(cat));
      }
    }

    console.log('✅ Categories seeded');
  }
}
