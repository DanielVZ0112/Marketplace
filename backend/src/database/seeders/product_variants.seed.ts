import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Product } from '../entities/product.entity';
import { ProductVariant } from '../entities/product-variant.entity';
import { Seeder } from './seed.interface';

@Injectable()
export class ProductVariantsSeeder implements Seeder {
  constructor(private dataSource: DataSource) {}

  async run() {
    const repo = this.dataSource.getRepository(ProductVariant);
    const productRepo = this.dataSource.getRepository(Product);

    // Obtener algunos productos para crear variantes
    const products = await productRepo.find({ take: 20 });

    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const colors = ['Negro', 'Blanco', 'Rojo', 'Azul', 'Verde', 'Gris', 'Beige', 'Marrón'];

    let variantCount = 0;

    for (const product of products) {
      // Crear 2-4 variantes por producto
      const numVariants = Math.floor(Math.random() * 3) + 2;
      const selectedColors = colors.sort(() => 0.5 - Math.random()).slice(0, numVariants);

      for (let i = 0; i < numVariants; i++) {
        const size = sizes[Math.floor(Math.random() * sizes.length)];
        const color = selectedColors[i];
        const stock = Math.floor(Math.random() * 50) + 10;
        const sku = `${product.name.substring(0, 3).toUpperCase()}-${size}-${color.substring(0, 3).toUpperCase()}-${variantCount + 1}`;

        const exists = await repo.findOne({ where: { sku } });
        if (!exists) {
          await repo.save(repo.create({
            product_id: product.id,
            size,
            color,
            stock,
            sku,
          }));
          variantCount++;
        }
      }
    }

    // Para productos restantes, crear al menos una variante
    const remainingProducts = await productRepo.find({ skip: 20 });
    for (const product of remainingProducts) {
      const size = sizes[Math.floor(Math.random() * sizes.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const stock = Math.floor(Math.random() * 50) + 10;
      const sku = `${product.name.substring(0, 3).toUpperCase()}-${size}-${color.substring(0, 3).toUpperCase()}-${variantCount + 1}`;

      const exists = await repo.findOne({ where: { sku } });
      if (!exists) {
        await repo.save(repo.create({
          product_id: product.id,
          size,
          color,
          stock,
          sku,
        }));
        variantCount++;
      }
    }

    console.log(`✅ Product variants seeded (${variantCount} variants created)`);
  }
}
