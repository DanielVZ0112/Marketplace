import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErpProveedor } from '../../database/entities/erp-proveedor.entity';
import { ErpProveedoresController } from './erp-proveedores.controller';
import { CreateErpProveedorUseCase } from './application/create-erp-proveedor.usecase';
import { ListErpProveedoresUseCase } from './application/list-erp-proveedores.usecase';
import { ErpProveedorTypeOrmRepository } from './infrastructure/erp-proveedor.typeorm.repository';
import { ERP_PROVEEDOR_REPOSITORY } from './domain/erp-proveedor.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ErpProveedor])],
  controllers: [ErpProveedoresController],
  providers: [
    CreateErpProveedorUseCase,
    ListErpProveedoresUseCase,
    {
      provide: ERP_PROVEEDOR_REPOSITORY,
      useClass: ErpProveedorTypeOrmRepository,
    },
  ],
  exports: [ERP_PROVEEDOR_REPOSITORY],
})
export class ErpProveedoresModule {}
