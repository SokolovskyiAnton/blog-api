import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDefaultValueComments1705964912966 implements MigrationInterface {
    name = 'AddDefaultValueComments1705964912966'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`comments\` CHANGE \`parentId\` \`parentId\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`comments\` CHANGE \`parentId\` \`parentId\` varchar(255) NOT NULL`);
    }

}
