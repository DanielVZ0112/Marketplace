import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateProductImageUrls1700000004000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Actualizar todos los productos con su URL de imagen basada en el ID
    // El formato será: {id}.jpg
    await queryRunner.query(`
      UPDATE products 
      SET image_url = id || '.jpg'
      WHERE image_url IS NULL OR image_url = '';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revertir: limpiar las URLs de imágenes
    await queryRunner.query(`
      UPDATE products 
      SET image_url = NULL
      WHERE image_url LIKE '%.jpg';
    `);
  }
}
