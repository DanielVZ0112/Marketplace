import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateErpTables1700000006000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'erp_parametros',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'costo_minuto',
            type: 'decimal',
            precision: 14,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'depreciacion_por_prenda',
            type: 'decimal',
            precision: 14,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'costo_fijo_min',
            type: 'decimal',
            precision: 14,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'costo_fijo_max',
            type: 'decimal',
            precision: 14,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'costo_fijo_default',
            type: 'decimal',
            precision: 14,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.query(`
      INSERT INTO erp_parametros (
        costo_minuto,
        depreciacion_por_prenda,
        costo_fijo_min,
        costo_fijo_max,
        costo_fijo_default
      ) VALUES (143.61, 79, 500, 1500, 1000)
    `);

    await queryRunner.createTable(
      new Table({
        name: 'erp_insumos',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'nombre',
            type: 'varchar',
            length: '150',
            isNullable: false,
          },
          {
            name: 'unidad_medida',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'costo_unitario',
            type: 'decimal',
            precision: 14,
            scale: 4,
            isNullable: false,
          },
          {
            name: 'stock_actual',
            type: 'decimal',
            precision: 14,
            scale: 4,
            isNullable: false,
          },
          {
            name: 'stock_minimo',
            type: 'decimal',
            precision: 14,
            scale: 4,
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'erp_cotizaciones',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'cliente_nombre',
            type: 'varchar',
            length: '200',
            isNullable: false,
          },
          {
            name: 'cliente_contacto',
            type: 'varchar',
            length: '200',
            isNullable: false,
          },
          {
            name: 'fecha',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'total_costo',
            type: 'decimal',
            precision: 14,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'total_precio',
            type: 'decimal',
            precision: 14,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'estado',
            type: 'varchar',
            length: '20',
            default: "'borrador'",
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'erp_cotizacion_items',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'cotizacion_id',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'descripcion_producto',
            type: 'varchar',
            length: '300',
            isNullable: false,
          },
          {
            name: 'cliente_trae_prenda',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'requiere_diseno',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'cantidad',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'minutos_diseno',
            type: 'decimal',
            precision: 14,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'minutos_produccion',
            type: 'decimal',
            precision: 14,
            scale: 2,
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
            name: 'costo_minuto',
            type: 'decimal',
            precision: 14,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'depreciacion',
            type: 'decimal',
            precision: 14,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'costo_fijo',
            type: 'decimal',
            precision: 14,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'costo_prenda',
            type: 'decimal',
            precision: 14,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'costo_tinta',
            type: 'decimal',
            precision: 14,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'costo_papel',
            type: 'decimal',
            precision: 14,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'costo_cinta',
            type: 'decimal',
            precision: 14,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'costo_empaque',
            type: 'decimal',
            precision: 14,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'costo_unitario',
            type: 'decimal',
            precision: 14,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'precio_unitario',
            type: 'decimal',
            precision: 14,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'subtotal',
            type: 'decimal',
            precision: 14,
            scale: 2,
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'erp_cotizacion_items',
      new TableForeignKey({
        columnNames: ['cotizacion_id'],
        referencedTableName: 'erp_cotizaciones',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'erp_cotizacion_item_insumos',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'cotizacion_item_id',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'insumo_id',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'rol',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'cantidad_usada',
            type: 'decimal',
            precision: 14,
            scale: 4,
            isNullable: false,
          },
          {
            name: 'costo_unitario_snapshot',
            type: 'decimal',
            precision: 14,
            scale: 4,
            isNullable: false,
          },
          {
            name: 'costo_linea',
            type: 'decimal',
            precision: 14,
            scale: 2,
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'erp_cotizacion_item_insumos',
      new TableForeignKey({
        columnNames: ['cotizacion_item_id'],
        referencedTableName: 'erp_cotizacion_items',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'erp_cotizacion_item_insumos',
      new TableForeignKey({
        columnNames: ['insumo_id'],
        referencedTableName: 'erp_insumos',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await this.dropForeignKeys(queryRunner, 'erp_cotizacion_item_insumos');
    await queryRunner.dropTable('erp_cotizacion_item_insumos');
    await this.dropForeignKeys(queryRunner, 'erp_cotizacion_items');
    await queryRunner.dropTable('erp_cotizacion_items');
    await queryRunner.dropTable('erp_cotizaciones');
    await queryRunner.dropTable('erp_insumos');
    await queryRunner.dropTable('erp_parametros');
  }

  private async dropForeignKeys(
    queryRunner: QueryRunner,
    tableName: string,
  ): Promise<void> {
    const table = await queryRunner.getTable(tableName);
    for (const foreignKey of table?.foreignKeys ?? []) {
      await queryRunner.dropForeignKey(tableName, foreignKey);
    }
  }
}
