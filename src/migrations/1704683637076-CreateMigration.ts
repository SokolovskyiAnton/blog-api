import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMigration1704683637076 implements MigrationInterface {
  name = 'CreateMigration1704683637076';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`_id\` varchar(36) NOT NULL, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`nickname\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`profession\` varchar(255) NOT NULL, \`skills\` varchar(1000) NOT NULL, \`dateCreated\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`avatar\` varchar(255) NULL, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`posts\` (\`_id\` varchar(36) NOT NULL, \`title\` varchar(255) NOT NULL, \`fullText\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`dateCreated\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`image\` varchar(255) NULL, \`likes\` int NOT NULL DEFAULT '0', \`postedBy_id\` varchar(36) NULL, PRIMARY KEY (\`_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`users_like_list_posts\` (\`users_id\` varchar(36) NOT NULL, \`posts_id\` varchar(36) NOT NULL, INDEX \`IDX_7a4bbc863b4e455191ebb0d2d8\` (\`users_id\`), INDEX \`IDX_77d27fc9e01067c3c7db9f4459\` (\`posts_id\`), PRIMARY KEY (\`users_id\`, \`posts_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`posts\` ADD CONSTRAINT \`FK_1e1ce575fe7191f4e8455ad472b\` FOREIGN KEY (\`postedBy_id\`) REFERENCES \`users\`(\`_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users_like_list_posts\` ADD CONSTRAINT \`FK_7a4bbc863b4e455191ebb0d2d8c\` FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`_id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users_like_list_posts\` ADD CONSTRAINT \`FK_77d27fc9e01067c3c7db9f44591\` FOREIGN KEY (\`posts_id\`) REFERENCES \`posts\`(\`_id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users_like_list_posts\` DROP FOREIGN KEY \`FK_77d27fc9e01067c3c7db9f44591\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users_like_list_posts\` DROP FOREIGN KEY \`FK_7a4bbc863b4e455191ebb0d2d8c\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`posts\` DROP FOREIGN KEY \`FK_1e1ce575fe7191f4e8455ad472b\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_77d27fc9e01067c3c7db9f4459\` ON \`users_like_list_posts\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_7a4bbc863b4e455191ebb0d2d8\` ON \`users_like_list_posts\``,
    );
    await queryRunner.query(`DROP TABLE \`users_like_list_posts\``);
    await queryRunner.query(`DROP TABLE \`posts\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``,
    );
    await queryRunner.query(`DROP TABLE \`users\``);
  }
}
