import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCommentEntity1705709534397 implements MigrationInterface {
  name = 'CreateCommentEntity1705709534397';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`comments\` (\`_id\` varchar(36) NOT NULL, \`text\` varchar(255) NOT NULL, \`dateCreated\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`likes\` int NOT NULL DEFAULT '0', \`mpath\` varchar(255) NULL DEFAULT '', \`parent_id\` varchar(36) NULL, \`commentedBy_id\` varchar(36) NULL, \`postId_id\` varchar(36) NULL, PRIMARY KEY (\`_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_d6f93329801a93536da4241e386\` FOREIGN KEY (\`parent_id\`) REFERENCES \`comments\`(\`_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_202d9da7ea7ad826eba70105986\` FOREIGN KEY (\`commentedBy_id\`) REFERENCES \`users\`(\`_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`comments\` ADD CONSTRAINT \`FK_9c3c2b59ec3b41ba730c11b28c5\` FOREIGN KEY (\`postId_id\`) REFERENCES \`posts\`(\`_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_9c3c2b59ec3b41ba730c11b28c5\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_202d9da7ea7ad826eba70105986\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`comments\` DROP FOREIGN KEY \`FK_d6f93329801a93536da4241e386\``,
    );
    await queryRunner.query(`DROP TABLE \`comments\``);
  }
}
