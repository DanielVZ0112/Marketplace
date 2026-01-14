import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { Seeder } from './seed.interface';

@Injectable()
export class ProductsSeeder implements Seeder {
  constructor(private dataSource: DataSource) {}

  async run() {
    const repo = this.dataSource.getRepository(Product);
    const catRepo = this.dataSource.getRepository(Category);

    // Obtener todas las categorías
    const categories = await catRepo.find();
    const categoryMap = new Map(categories.map(cat => [cat.slug, cat]));

    const products = [
      // Camisetas
      { name: 'Camiseta Básica Blanca', description: 'Camiseta de algodón 100% básica y cómoda', price: 15.99, category: categoryMap.get('camisetas') },
      { name: 'Camiseta Básica Negra', description: 'Camiseta de algodón 100% básica y cómoda', price: 15.99, category: categoryMap.get('camisetas') },
      { name: 'Camiseta Manga Larga', description: 'Camiseta de manga larga para temporada fría', price: 24.99, category: categoryMap.get('camisetas') },
      { name: 'Camiseta Polo Clásica', description: 'Camiseta polo elegante para ocasiones formales', price: 29.99, category: categoryMap.get('camisetas') },
      { name: 'Camiseta Estampada', description: 'Camiseta con estampado moderno y colorido', price: 19.99, category: categoryMap.get('camisetas') },
      { name: 'Camiseta Deportiva', description: 'Camiseta técnica para deportes', price: 22.99, category: categoryMap.get('camisetas') },
      { name: 'Camiseta V-Neck', description: 'Camiseta con cuello en V', price: 18.99, category: categoryMap.get('camisetas') },
      { name: 'Camiseta Oversized', description: 'Camiseta holgada estilo oversized', price: 21.99, category: categoryMap.get('camisetas') },

      // Pantalones
      { name: 'Pantalón Vaquero Clásico', description: 'Pantalón vaquero de corte clásico', price: 49.99, category: categoryMap.get('pantalones') },
      { name: 'Pantalón Chino', description: 'Pantalón chino elegante y versátil', price: 39.99, category: categoryMap.get('pantalones') },
      { name: 'Pantalón Deportivo', description: 'Pantalón cómodo para hacer deporte', price: 34.99, category: categoryMap.get('pantalones') },
      { name: 'Pantalón Cargo', description: 'Pantalón cargo con múltiples bolsillos', price: 44.99, category: categoryMap.get('pantalones') },
      { name: 'Pantalón Skinny', description: 'Pantalón ajustado estilo skinny', price: 42.99, category: categoryMap.get('pantalones') },
      { name: 'Pantalón Recto', description: 'Pantalón de corte recto clásico', price: 45.99, category: categoryMap.get('pantalones') },
      { name: 'Pantalón Corto', description: 'Pantalón corto para verano', price: 24.99, category: categoryMap.get('pantalones') },
      { name: 'Pantalón de Vestir', description: 'Pantalón elegante para ocasiones formales', price: 59.99, category: categoryMap.get('pantalones') },

      // Zapatos
      { name: 'Zapatillas Deportivas', description: 'Zapatillas cómodas para correr', price: 79.99, category: categoryMap.get('zapatos') },
      { name: 'Zapatos de Cuero', description: 'Zapatos elegantes de cuero genuino', price: 89.99, category: categoryMap.get('zapatos') },
      { name: 'Sneakers Urbanas', description: 'Zapatillas urbanas estilo casual', price: 69.99, category: categoryMap.get('zapatos') },
      { name: 'Botas de Cuero', description: 'Botas resistentes de cuero', price: 99.99, category: categoryMap.get('zapatos') },
      { name: 'Mocasines', description: 'Mocasines elegantes sin cordones', price: 64.99, category: categoryMap.get('zapatos') },
      { name: 'Zapatos Deportivos', description: 'Zapatos especializados para deportes', price: 84.99, category: categoryMap.get('zapatos') },
      { name: 'Sandalias', description: 'Sandalias cómodas para verano', price: 29.99, category: categoryMap.get('zapatos') },
      { name: 'Zapatillas de Lona', description: 'Zapatillas clásicas de lona', price: 34.99, category: categoryMap.get('zapatos') },

      // Chaquetas
      { name: 'Chaqueta Vaquera', description: 'Chaqueta vaquera clásica', price: 69.99, category: categoryMap.get('chaquetas') },
      { name: 'Chaqueta de Cuero', description: 'Chaqueta de cuero genuino', price: 149.99, category: categoryMap.get('chaquetas') },
      { name: 'Chaqueta Impermeable', description: 'Chaqueta impermeable para lluvia', price: 54.99, category: categoryMap.get('chaquetas') },
      { name: 'Chaqueta Deportiva', description: 'Chaqueta ligera para deportes', price: 44.99, category: categoryMap.get('chaquetas') },
      { name: 'Chaqueta de Piel', description: 'Chaqueta elegante de piel sintética', price: 79.99, category: categoryMap.get('chaquetas') },
      { name: 'Chaqueta Bomber', description: 'Chaqueta bomber estilo urbano', price: 59.99, category: categoryMap.get('chaquetas') },

      // Vestidos
      { name: 'Vestido Casual', description: 'Vestido cómodo para uso diario', price: 39.99, category: categoryMap.get('vestidos') },
      { name: 'Vestido Elegante', description: 'Vestido elegante para ocasiones especiales', price: 79.99, category: categoryMap.get('vestidos') },
      { name: 'Vestido de Verano', description: 'Vestido ligero y fresco para verano', price: 34.99, category: categoryMap.get('vestidos') },
      { name: 'Vestido Largo', description: 'Vestido largo elegante', price: 64.99, category: categoryMap.get('vestidos') },
      { name: 'Vestido Corto', description: 'Vestido corto casual', price: 29.99, category: categoryMap.get('vestidos') },

      // Accesorios
      { name: 'Gorra Deportiva', description: 'Gorra ajustable para deportes', price: 19.99, category: categoryMap.get('accesorios') },
      { name: 'Bufanda de Lana', description: 'Bufanda cálida de lana', price: 24.99, category: categoryMap.get('accesorios') },
      { name: 'Guantes de Invierno', description: 'Guantes cálidos para invierno', price: 18.99, category: categoryMap.get('accesorios') },
      { name: 'Cinturón de Cuero', description: 'Cinturón elegante de cuero', price: 29.99, category: categoryMap.get('accesorios') },
      { name: 'Gafas de Sol', description: 'Gafas de sol con protección UV', price: 39.99, category: categoryMap.get('accesorios') },
      { name: 'Gorra Plana', description: 'Gorra plana estilo urbano', price: 22.99, category: categoryMap.get('accesorios') },

      // Ropa Interior
      { name: 'Pack Boxers', description: 'Pack de 3 boxers de algodón', price: 24.99, category: categoryMap.get('ropa-interior') },
      { name: 'Pack Calcetines', description: 'Pack de 6 pares de calcetines', price: 19.99, category: categoryMap.get('ropa-interior') },
      { name: 'Camiseta Interior', description: 'Camiseta interior térmica', price: 16.99, category: categoryMap.get('ropa-interior') },

      // Deportes
      { name: 'Chándal Completo', description: 'Chándal completo para deportes', price: 54.99, category: categoryMap.get('deportes') },
      { name: 'Leggings Deportivos', description: 'Leggings cómodos para entrenar', price: 34.99, category: categoryMap.get('deportes') },
      { name: 'Top Deportivo', description: 'Top deportivo para mujer', price: 24.99, category: categoryMap.get('deportes') },
      { name: 'Shorts Deportivos', description: 'Shorts para hacer ejercicio', price: 22.99, category: categoryMap.get('deportes') },

      // Bolsos
      { name: 'Bolso de Mano', description: 'Bolso elegante de mano', price: 49.99, category: categoryMap.get('bolsos') },
      { name: 'Mochila Urbana', description: 'Mochila cómoda para uso diario', price: 39.99, category: categoryMap.get('bolsos') },
      { name: 'Bolso Tote', description: 'Bolso tote espacioso', price: 34.99, category: categoryMap.get('bolsos') },
      { name: 'Cartera de Cuero', description: 'Cartera elegante de cuero', price: 29.99, category: categoryMap.get('bolsos') },

      // Relojes
      { name: 'Reloj Deportivo', description: 'Reloj resistente para deportes', price: 79.99, category: categoryMap.get('relojes') },
      { name: 'Reloj Elegante', description: 'Reloj elegante para ocasiones formales', price: 129.99, category: categoryMap.get('relojes') },
      { name: 'Reloj Inteligente', description: 'Reloj inteligente con múltiples funciones', price: 199.99, category: categoryMap.get('relojes') },
      { name: 'Reloj Clásico', description: 'Reloj clásico de pulsera', price: 89.99, category: categoryMap.get('relojes') },
    ];

    for (const productData of products) {
      if (!productData.category) continue;
      
      const exists = await repo.findOne({ where: { name: productData.name } });
      if (!exists) {
        const newProduct = await repo.save(repo.create({
          name: productData.name,
          description: productData.description,
          price: productData.price,
          category_id: productData.category.id,
          is_active: true,
        }));
        
        newProduct.image_url = `${newProduct.id}.jpg`;
        await repo.save(newProduct);
      }
    }

    console.log('✅ Products seeded');
  }
}
