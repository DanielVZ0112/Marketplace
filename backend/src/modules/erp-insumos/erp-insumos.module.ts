import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErpInsumo } from '../../database/entities/erp-insumo.entity';
import { ErpInsumosController } from './erp-insumos.controller';
import { CreateErpInsumoUseCase } from './application/create-erp-insumo.usecase';
import { ListErpInsumosUseCase } from './application/list-erp-insumos.usecase';
import { GetErpInsumoByIdUseCase } from './application/get-erp-insumo-by-id.usecase';
import { UpdateErpInsumoUseCase } from './application/update-erp-insumo.usecase';
import { ErpInsumoTypeOrmRepository } from './infrastructure/erp-insumo.typeorm.repository';
import { ERP_INSUMO_REPOSITORY } from './domain/erp-insumo.repository';
import { ErpCategoriasModule } from '../erp-categorias/erp-categorias.module';
import { ErpProveedoresModule } from '../erp-proveedores/erp-proveedores.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ErpInsumo]),
    ErpCategoriasModule,
    ErpProveedoresModule,
  ],
  controllers: [ErpInsumosController],
  providers: [
    CreateErpInsumoUseCase,
    ListErpInsumosUseCase,
    GetErpInsumoByIdUseCase,
    UpdateErpInsumoUseCase,
    {
      provide: ERP_INSUMO_REPOSITORY,
      useClass: ErpInsumoTypeOrmRepository,
    },
  ],
  exports: [ERP_INSUMO_REPOSITORY],
})
export class ErpInsumosModule {}
