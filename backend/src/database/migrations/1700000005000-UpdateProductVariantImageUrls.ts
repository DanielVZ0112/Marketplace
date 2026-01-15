import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateProductVariantImageUrls1700000005000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Actualizar todas las variantes para que usen la imagen del producto (product_id)
    // en lugar de su propio ID
    await queryRunner.query(`
      UPDATE product_variants pv
      SET image_url = (
        SELECT image_url 
        FROM products p 
        WHERE p.id = pv.product_id
      )
      WHERE image_url IS NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revertir: restaurar las URLs basadas en el ID de la variante
    await queryRunner.query(`
      UPDATE product_variants 
      SET image_url = id || '.jpg'
      WHERE image_url IS NOT NULL;
    `);
  }
}
