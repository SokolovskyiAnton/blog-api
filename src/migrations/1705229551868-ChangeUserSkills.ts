import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeUserSkills1705229551868 implements MigrationInterface {
    name = 'ChangeUserSkills1705229551868'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`skills\` \`skills\` varchar(1000) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`skills\` \`skills\` varchar(1000) NOT NULL`);
    }

}
