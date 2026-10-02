import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErpCotizacion } from '../../database/entities/erp-cotizacion.entity';
import { ErpCotizacionItem } from '../../database/entities/erp-cotizacion-item.entity';
import { ErpCotizacionItemInsumo } from '../../database/entities/erp-cotizacion-item-insumo.entity';
import { ErpCotizacionTrabajo } from '../../database/entities/erp-cotizacion-trabajo.entity';
import { ErpInsumosModule } from '../erp-insumos/erp-insumos.module';
import { ErpParametrosModule } from '../erp-parametros/erp-parametros.module';
import { ErpCotizacionesController } from './erp-cotizaciones.controller';
import { CalcularCotizacionUseCase } from './application/calcular-cotizacion.usecase';
import { CreateCotizacionUseCase } from './application/create-cotizacion.usecase';
import { ListCotizacionesUseCase } from './application/list-cotizaciones.usecase';
import { GetCotizacionByIdUseCase } from './application/get-cotizacion-by-id.usecase';
import { UpdateCotizacionEstadoUseCase } from './application/update-cotizacion-estado.usecase';
import { UpdateCotizacionUseCase } from './application/update-cotizacion.usecase';
import { ErpCotizacionTypeOrmRepository } from './infrastructure/erp-cotizacion.typeorm.repository';
import { ERP_COTIZACION_REPOSITORY } from './domain/erp-cotizacion.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ErpCotizacion,
      ErpCotizacionItem,
      ErpCotizacionItemInsumo,
      ErpCotizacionTrabajo,
    ]),
    ErpInsumosModule,
    ErpParametrosModule,
  ],
  controllers: [ErpCotizacionesController],
  providers: [
    CalcularCotizacionUseCase,
    CreateCotizacionUseCase,
    ListCotizacionesUseCase,
    GetCotizacionByIdUseCase,
    UpdateCotizacionEstadoUseCase,
    UpdateCotizacionUseCase,
    {
      provide: ERP_COTIZACION_REPOSITORY,
      useClass: ErpCotizacionTypeOrmRepository,
    },
  ],
})
export class ErpCotizacionesModule {}
