import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLikesToComments1705971602165 implements MigrationInterface {
    name = 'AddLikesToComments1705971602165'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users_comments_like_list_comments\` (\`users_id\` varchar(36) NOT NULL, \`comments_id\` varchar(36) NOT NULL, INDEX \`IDX_99141cad06ea9c21624cd9ae06\` (\`users_id\`), INDEX \`IDX_6d49b499f0d7172c71b002eeda\` (\`comments_id\`), PRIMARY KEY (\`users_id\`, \`comments_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`users_comments_like_list_comments\` ADD CONSTRAINT \`FK_99141cad06ea9c21624cd9ae062\` FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`_id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`users_comments_like_list_comments\` ADD CONSTRAINT \`FK_6d49b499f0d7172c71b002eedaf\` FOREIGN KEY (\`comments_id\`) REFERENCES \`comments\`(\`_id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users_comments_like_list_comments\` DROP FOREIGN KEY \`FK_6d49b499f0d7172c71b002eedaf\``);
        await queryRunner.query(`ALTER TABLE \`users_comments_like_list_comments\` DROP FOREIGN KEY \`FK_99141cad06ea9c21624cd9ae062\``);
        await queryRunner.query(`DROP INDEX \`IDX_6d49b499f0d7172c71b002eeda\` ON \`users_comments_like_list_comments\``);
        await queryRunner.query(`DROP INDEX \`IDX_99141cad06ea9c21624cd9ae06\` ON \`users_comments_like_list_comments\``);
        await queryRunner.query(`DROP TABLE \`users_comments_like_list_comments\``);
    }

}
