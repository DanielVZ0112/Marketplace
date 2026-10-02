import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CustomersModule } from './modules/customers/customers.module';
import { UsersModule } from './modules/users/users.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ProductVariantsModule } from './modules/product-variants/product-variants.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { AuthModule } from './modules/auth/auth.module';
import { ErpParametrosModule } from './modules/erp-parametros/erp-parametros.module';
import { ErpCategoriasModule } from './modules/erp-categorias/erp-categorias.module';
import { ErpProveedoresModule } from './modules/erp-proveedores/erp-proveedores.module';
import { ErpInsumosModule } from './modules/erp-insumos/erp-insumos.module';
import { ErpCotizacionesModule } from './modules/erp-cotizaciones/erp-cotizaciones.module';
import { JwtAuthGuard } from './modules/auth/infrastructure/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: false,
      migrations: ['dist/database/migrations/*.js'],
      migrationsRun: false,
    }),
    ProductsModule,
    CategoriesModule,
    CustomersModule,
    UsersModule,
    OrdersModule,
    ProductVariantsModule,
    PaymentsModule,
    AuthModule,
    ErpParametrosModule,
    ErpCategoriasModule,
    ErpProveedoresModule,
    ErpInsumosModule,
    ErpCotizacionesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
