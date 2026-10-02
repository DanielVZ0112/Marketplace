import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Category } from './entities/category.entity';
import { User } from './entities/user.entity';
import { Customer } from './entities/customer.entity';
import { Product } from './entities/product.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Payment } from './entities/payment.entity';
import { ErpParametro } from './entities/erp-parametro.entity';
import { ErpInsumo } from './entities/erp-insumo.entity';
import { ErpCategoria } from './entities/erp-categoria.entity';
import { ErpProveedor } from './entities/erp-proveedor.entity';
import { ErpCotizacion } from './entities/erp-cotizacion.entity';
import { ErpCotizacionItem } from './entities/erp-cotizacion-item.entity';
import { ErpCotizacionItemInsumo } from './entities/erp-cotizacion-item-insumo.entity';
import { ErpCotizacionTrabajo } from './entities/erp-cotizacion-trabajo.entity';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'marketplace_db',
  entities: [
    Category,
    User,
    Customer,
    Product,
    ProductVariant,
    Order,
    OrderItem,
    Payment,
    ErpParametro,
    ErpCategoria,
    ErpProveedor,
    ErpInsumo,
    ErpCotizacion,
    ErpCotizacionItem,
    ErpCotizacionTrabajo,
    ErpCotizacionItemInsumo,
  ],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
  logging: true,
});
