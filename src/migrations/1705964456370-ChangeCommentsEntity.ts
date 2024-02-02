import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeCommentsEntity1705964456370 implements MigrationInterface {
  name = 'ChangeCommentsEntity1705964456370';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_d6f93329801a93536da4241e386\``,
    );
    await queryRunner.query(`ALTER TABLE \`comments\` DROP COLUMN \`mpath\``);
    await queryRunner.query(
      `ALTER TABLE \`comments\` DROP COLUMN \`parent_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`comments\` ADD \`parentId\` varchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`comments\` DROP COLUMN \`parentId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`comments\` ADD \`parent_id\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`comments\` ADD \`mpath\` varchar(255) NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_d6f93329801a93536da4241e386\` FOREIGN KEY (\`parent_id\`) REFERENCES \`comments\`(\`_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
