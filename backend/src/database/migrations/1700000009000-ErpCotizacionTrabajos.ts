import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class ErpCotizacionTrabajos1700000009000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'erp_cotizacion_trabajos',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'cotizacion_id', type: 'integer', isNullable: false },
          { name: 'orden', type: 'integer', isNullable: false },
          {
            name: 'requiere_diseno',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'diseno_por_valor',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'valor_diseno',
            type: 'decimal',
            precision: 14,
            scale: 2,
            default: 0,
            isNullable: false,
          },
          {
            name: 'minutos_diseno',
            type: 'decimal',
            precision: 14,
            scale: 2,
            default: 0,
            isNullable: false,
          },
          {
            name: 'margen_esperado',
            type: 'decimal',
            precision: 5,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'descuento_porcentaje',
            type: 'decimal',
            precision: 5,
            scale: 2,
            default: 0,
            isNullable: false,
          },
          {
            name: 'costo_minuto',
            type: 'decimal',
            precision: 14,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'costo_diseno',
            type: 'decimal',
            precision: 14,
            scale: 2,
            default: 0,
            isNullable: false,
          },
          {
            name: 'precio_diseno',
            type: 'decimal',
            precision: 14,
            scale: 2,
            default: 0,
            isNullable: false,
          },
          {
            name: 'diseno_en_items',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          { name: 'item_origen_id', type: 'integer', isNullable: true },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'erp_cotizacion_trabajos',
      new TableForeignKey({
        columnNames: ['cotizacion_id'],
        referencedTableName: 'erp_cotizaciones',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.query(`
      INSERT INTO erp_cotizacion_trabajos (
        cotizacion_id,
        orden,
        requiere_diseno,
        diseno_por_valor,
        valor_diseno,
        minutos_diseno,
        margen_esperado,
        descuento_porcentaje,
        costo_minuto,
        costo_diseno,
        precio_diseno,
        diseno_en_items,
        item_origen_id
      )
      SELECT
        cotizacion_id,
        ROW_NUMBER() OVER (PARTITION BY cotizacion_id ORDER BY id),
        requiere_diseno,
        diseno_por_valor,
        valor_diseno,
        minutos_diseno,
        margen_esperado,
        descuento_porcentaje,
        costo_minuto,
        0,
        0,
        true,
        id
      FROM erp_cotizacion_items
    `);

    await queryRunner.addColumn(
      'erp_cotizacion_items',
      new TableColumn({
        name: 'trabajo_id',
        type: 'integer',
        isNullable: true,
      }),
    );

    await queryRunner.query(`
      UPDATE erp_cotizacion_items AS item
      SET trabajo_id = trabajo.id
      FROM erp_cotizacion_trabajos AS trabajo
      WHERE trabajo.item_origen_id = item.id
    `);

    await queryRunner.query(`
      ALTER TABLE erp_cotizacion_items
      ALTER COLUMN trabajo_id SET NOT NULL
    `);

    await queryRunner.createForeignKey(
      'erp_cotizacion_items',
      new TableForeignKey({
        columnNames: ['trabajo_id'],
        referencedTableName: 'erp_cotizacion_trabajos',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.dropColumn('erp_cotizacion_trabajos', 'item_origen_id');
    await queryRunner.dropColumns('erp_cotizacion_items', [
      'requiere_diseno',
      'diseno_por_valor',
      'valor_diseno',
      'descuento_porcentaje',
      'minutos_diseno',
      'margen_esperado',
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('erp_cotizacion_items', [
      new TableColumn({
        name: 'requiere_diseno',
        type: 'boolean',
        default: false,
        isNullable: false,
      }),
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
      new TableColumn({
        name: 'minutos_diseno',
        type: 'decimal',
        precision: 14,
        scale: 2,
        default: 0,
        isNullable: false,
      }),
      new TableColumn({
        name: 'margen_esperado',
        type: 'decimal',
        precision: 5,
        scale: 2,
        default: 0,
        isNullable: false,
      }),
    ]);

    await queryRunner.query(`
      UPDATE erp_cotizacion_items AS item
      SET
        requiere_diseno = trabajo.requiere_diseno,
        diseno_por_valor = trabajo.diseno_por_valor,
        valor_diseno = trabajo.valor_diseno,
        descuento_porcentaje = trabajo.descuento_porcentaje,
        minutos_diseno = trabajo.minutos_diseno,
        margen_esperado = trabajo.margen_esperado
      FROM erp_cotizacion_trabajos AS trabajo
      WHERE item.trabajo_id = trabajo.id
    `);

    const itemTable = await queryRunner.getTable('erp_cotizacion_items');
    const trabajoForeignKey = itemTable?.foreignKeys.find((key) =>
      key.columnNames.includes('trabajo_id'),
    );
    if (trabajoForeignKey) {
      await queryRunner.dropForeignKey(
        'erp_cotizacion_items',
        trabajoForeignKey,
      );
    }
    await queryRunner.dropColumn('erp_cotizacion_items', 'trabajo_id');
    await queryRunner.dropTable('erp_cotizacion_trabajos');
  }
}
