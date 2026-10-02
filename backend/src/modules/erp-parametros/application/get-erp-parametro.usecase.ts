import {
  Injectable,
  Inject,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import type { ErpParametroRepository } from '../domain/erp-parametro.repository';
import { ERP_PARAMETRO_REPOSITORY } from '../domain/erp-parametro.repository';
import { ErpParametro } from '../../../database/entities/erp-parametro.entity';

@Injectable()
export class GetErpParametroUseCase {
  constructor(
    @Inject(ERP_PARAMETRO_REPOSITORY)
    private readonly parametroRepository: ErpParametroRepository,
  ) {}

  async execute(): Promise<ErpParametro> {
    try {
      const parametro = await this.parametroRepository.findOne();
      if (!parametro) {
        throw new NotFoundException(
          'No hay parámetros de costeo. Ejecuta las migraciones del ERP.',
        );
      }
      return parametro;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error al obtener los parámetros de costeo',
      );
    }
  }
}
