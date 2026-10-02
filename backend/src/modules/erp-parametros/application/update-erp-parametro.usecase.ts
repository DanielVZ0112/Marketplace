import {
  Injectable,
  Inject,
  BadRequestException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import type { ErpParametroRepository } from '../domain/erp-parametro.repository';
import { ERP_PARAMETRO_REPOSITORY } from '../domain/erp-parametro.repository';
import { ErpParametro } from '../../../database/entities/erp-parametro.entity';
import { UpdateErpParametroDto } from './dto/update-erp-parametro.dto';
import { GetErpParametroUseCase } from './get-erp-parametro.usecase';
import { calcularManoObra } from '../domain/mano-obra';

@Injectable()
export class UpdateErpParametroUseCase {
  constructor(
    @Inject(ERP_PARAMETRO_REPOSITORY)
    private readonly parametroRepository: ErpParametroRepository,
    private readonly getErpParametroUseCase: GetErpParametroUseCase,
  ) {}

  async execute(dto: UpdateErpParametroDto): Promise<ErpParametro> {
    if (dto.costo_fijo_min > dto.costo_fijo_max) {
      throw new BadRequestException(
        'El costo fijo mínimo no puede ser mayor que el máximo',
      );
    }
    if (
      dto.costo_fijo_default < dto.costo_fijo_min ||
      dto.costo_fijo_default > dto.costo_fijo_max
    ) {
      throw new BadRequestException(
        'El costo fijo por defecto debe estar entre el mínimo y el máximo',
      );
    }

    const payload = { ...dto };
    if (!dto.calculo_manual) {
      payload.costo_minuto = calcularManoObra(dto).costo_minuto;
    }

    try {
      const current = await this.getErpParametroUseCase.execute();
      return await this.parametroRepository.update(current.id, payload);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error al actualizar los parámetros de costeo',
      );
    }
  }
}
