import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErpParametro } from '../../database/entities/erp-parametro.entity';
import { ErpParametrosController } from './erp-parametros.controller';
import { GetErpParametroUseCase } from './application/get-erp-parametro.usecase';
import { UpdateErpParametroUseCase } from './application/update-erp-parametro.usecase';
import { ErpParametroTypeOrmRepository } from './infrastructure/erp-parametro.typeorm.repository';
import { ERP_PARAMETRO_REPOSITORY } from './domain/erp-parametro.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ErpParametro])],
  controllers: [ErpParametrosController],
  providers: [
    GetErpParametroUseCase,
    UpdateErpParametroUseCase,
    {
      provide: ERP_PARAMETRO_REPOSITORY,
      useClass: ErpParametroTypeOrmRepository,
    },
  ],
  exports: [ERP_PARAMETRO_REPOSITORY],
})
export class ErpParametrosModule {}
