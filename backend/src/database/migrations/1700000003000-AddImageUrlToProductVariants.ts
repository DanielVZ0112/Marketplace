import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddImageUrlToProductVariants1700000003000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'product_variants',
      new TableColumn({
        name: 'image_url',
        type: 'varchar',
        length: '500',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('product_variants', 'image_url');
  }
}
