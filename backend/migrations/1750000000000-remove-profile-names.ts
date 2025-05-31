import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveProfileNames1750000000000 implements MigrationInterface {
    name = 'RemoveProfileNames1750000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`profiles\` DROP COLUMN \`firstName\``);
        await queryRunner.query(`ALTER TABLE \`profiles\` DROP COLUMN \`lastName\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`profiles\` ADD \`firstName\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`profiles\` ADD \`lastName\` varchar(255) NOT NULL`);
    }
}
