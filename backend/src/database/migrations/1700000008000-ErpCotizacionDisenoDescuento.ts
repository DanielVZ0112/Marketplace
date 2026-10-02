import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ErpCotizacionDisenoDescuento1700000008000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('erp_cotizacion_items', [
      new TableColumn({
        name: 'diseno_por_valor',
        type: 'boolean',
        default: false,
        isNullable: false,
      }),
      new TableColumn({
        name: 'valor_diseno',
        type: 'decimal',
        precision: 14,
        scale: 2,
        default: 0,
        isNullable: false,
      }),
      new TableColumn({
        name: 'descuento_porcentaje',
        type: 'decimal',
        precision: 5,
        scale: 2,
        default: 0,
        isNullable: false,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('erp_cotizacion_items', [
      'diseno_por_valor',
      'valor_diseno',
      'descuento_porcentaje',
    ]);
  }
}
