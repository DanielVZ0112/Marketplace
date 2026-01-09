// src/database/seeders/seed.ts
import { DataSource } from 'typeorm';
import { CategoriesSeeder } from './categories.seed';
import { UsersSeeder } from './users.seed';
import { CustomersSeeder } from './customer.seed';
import { ProductsSeeder } from './products.seed';
import { ProductVariantsSeeder } from './product_variants.seed';

export async function runSeeders(dataSource: DataSource) {
  console.log('🌱 Starting seeders...\n');

  // 1. Categorías primero
  const categoriesSeeder = new CategoriesSeeder(dataSource);
  await categoriesSeeder.run();

  // 2. Usuarios
  const usersSeeder = new UsersSeeder(dataSource);
  await usersSeeder.run();

  // 3. Clientes (dependen de usuarios)
  const customersSeeder = new CustomersSeeder(dataSource);
  await customersSeeder.run();

  // 4. Productos (dependen de categorías)
  const productsSeeder = new ProductsSeeder(dataSource);
  await productsSeeder.run();

  // 5. Variantes de productos (dependen de productos)
  const variantsSeeder = new ProductVariantsSeeder(dataSource);
  await variantsSeeder.run();

  console.log('\n🎉 All seeders completed successfully!');
}
