import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeUser1705229432019 implements MigrationInterface {
    name = 'ChangeUser1705229432019'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`nickname\` \`nickname\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`profession\` \`profession\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`profession\` \`profession\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`nickname\` \`nickname\` varchar(255) NOT NULL`);
    }

}
