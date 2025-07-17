import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterCollectionCascade1752716182756 implements MigrationInterface {
  name = 'AlterCollectionCascade1752716182756';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_a39d98111ddda0b737e683ff847"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_a39d98111ddda0b737e683ff847" FOREIGN KEY ("collectionId") REFERENCES "collection"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_a39d98111ddda0b737e683ff847"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_a39d98111ddda0b737e683ff847" FOREIGN KEY ("collectionId") REFERENCES "collection"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }
}
