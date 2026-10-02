import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErpCategoria } from '../../database/entities/erp-categoria.entity';
import { ErpCategoriasController } from './erp-categorias.controller';
import { CreateErpCategoriaUseCase } from './application/create-erp-categoria.usecase';
import { ListErpCategoriasUseCase } from './application/list-erp-categorias.usecase';
import { ErpCategoriaTypeOrmRepository } from './infrastructure/erp-categoria.typeorm.repository';
import { ERP_CATEGORIA_REPOSITORY } from './domain/erp-categoria.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ErpCategoria])],
  controllers: [ErpCategoriasController],
  providers: [
    CreateErpCategoriaUseCase,
    ListErpCategoriasUseCase,
    {
      provide: ERP_CATEGORIA_REPOSITORY,
      useClass: ErpCategoriaTypeOrmRepository,
    },
  ],
  exports: [ERP_CATEGORIA_REPOSITORY],
})
export class ErpCategoriasModule {}
