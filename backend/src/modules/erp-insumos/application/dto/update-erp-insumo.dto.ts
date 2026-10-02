import { PartialType } from '@nestjs/mapped-types';
import { CreateErpInsumoDto } from './create-erp-insumo.dto';

export class UpdateErpInsumoDto extends PartialType(CreateErpInsumoDto) {}
