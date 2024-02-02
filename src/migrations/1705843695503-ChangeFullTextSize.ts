import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeFullTextSize1705843695503 implements MigrationInterface {
  name = 'ChangeFullTextSize1705843695503';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`posts\` DROP COLUMN \`fullText\``);
    await queryRunner.query(
      `ALTER TABLE \`posts\` ADD \`fullText\` longtext NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`posts\` DROP COLUMN \`fullText\``);
    await queryRunner.query(
      `ALTER TABLE \`posts\` ADD \`fullText\` varchar(255) NOT NULL`,
    );
  }
}
