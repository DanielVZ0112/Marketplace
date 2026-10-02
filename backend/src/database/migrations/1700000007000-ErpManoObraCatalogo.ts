import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class ErpManoObraCatalogo1700000007000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('erp_parametros', [
      new TableColumn({
        name: 'smlmv_base',
        type: 'decimal',
        precision: 14,
        scale: 2,
        default: 1423500,
        isNullable: false,
      }),
      new TableColumn({
        name: 'auxilio_transporte',
        type: 'decimal',
        precision: 14,
        scale: 2,
        default: 162000,
        isNullable: false,
      }),
      new TableColumn({
        name: 'horas_mes',
        type: 'decimal',
        precision: 14,
        scale: 2,
        default: 184,
        isNullable: false,
      }),
      new TableColumn({
        name: 'porcentaje_prestaciones',
        type: 'decimal',
        precision: 8,
        scale: 2,
        default: 52,
        isNullable: false,
      }),
      new TableColumn({
        name: 'calculo_manual',
        type: 'boolean',
        default: false,
        isNullable: false,
      }),
    ]);

    await queryRunner.query('UPDATE erp_parametros SET calculo_manual = true');

    await queryRunner.createTable(
      new Table({
        name: 'erp_categorias',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'nombre', type: 'varchar', length: '120', isNullable: false },
          {
            name: 'descripcion',
            type: 'varchar',
            length: '300',
            isNullable: true,
          },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    await queryRunner.query(`
      INSERT INTO erp_categorias (nombre, descripcion)
      VALUES ('General', 'Categoría por defecto')
    `);

    await queryRunner.createTable(
      new Table({
        name: 'erp_proveedores',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'nombre', type: 'varchar', length: '150', isNullable: false },
          {
            name: 'contacto',
            type: 'varchar',
            length: '150',
            isNullable: true,
          },
          { name: 'telefono', type: 'varchar', length: '40', isNullable: true },
          {
            name: 'sitio_web',
            type: 'varchar',
            length: '200',
            isNullable: true,
          },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    await queryRunner.addColumn(
      'erp_insumos',
      new TableColumn({
        name: 'categoria_id',
        type: 'integer',
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'erp_insumos',
      new TableColumn({
        name: 'proveedor_id',
        type: 'integer',
        isNullable: true,
      }),
    );

    await queryRunner.query(`
      UPDATE erp_insumos
      SET categoria_id = (SELECT id FROM erp_categorias WHERE nombre = 'General' LIMIT 1)
      WHERE categoria_id IS NULL
    `);

    await queryRunner.changeColumn(
      'erp_insumos',
      'categoria_id',
      new TableColumn({
        name: 'categoria_id',
        type: 'integer',
        isNullable: false,
      }),
    );

    await queryRunner.createForeignKey(
      'erp_insumos',
      new TableForeignKey({
        columnNames: ['categoria_id'],
        referencedTableName: 'erp_categorias',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );
    await queryRunner.createForeignKey(
      'erp_insumos',
      new TableForeignKey({
        columnNames: ['proveedor_id'],
        referencedTableName: 'erp_proveedores',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const insumos = await queryRunner.getTable('erp_insumos');
    for (const foreignKey of insumos?.foreignKeys ?? []) {
      if (
        foreignKey.columnNames.includes('categoria_id') ||
        foreignKey.columnNames.includes('proveedor_id')
      ) {
        await queryRunner.dropForeignKey('erp_insumos', foreignKey);
      }
    }
    await queryRunner.dropColumn('erp_insumos', 'proveedor_id');
    await queryRunner.dropColumn('erp_insumos', 'categoria_id');
    await queryRunner.dropTable('erp_proveedores');
    await queryRunner.dropTable('erp_categorias');
    await queryRunner.dropColumn('erp_parametros', 'calculo_manual');
    await queryRunner.dropColumn('erp_parametros', 'porcentaje_prestaciones');
    await queryRunner.dropColumn('erp_parametros', 'horas_mes');
    await queryRunner.dropColumn('erp_parametros', 'auxilio_transporte');
    await queryRunner.dropColumn('erp_parametros', 'smlmv_base');
  }
}
