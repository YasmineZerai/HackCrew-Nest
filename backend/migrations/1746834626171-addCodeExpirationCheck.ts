import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCodeExpirationCheck1746834626171 implements MigrationInterface {
  name = 'AddCodeExpirationCheck1746834626171';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE \`codes\` 
        MODIFY COLUMN \`expiresAt\` timestamp NOT NULL
        `);
    await queryRunner.query(`
        ALTER TABLE \`codes\` 
        ADD COLUMN IF NOT EXISTS \`isExpired\` boolean NOT NULL DEFAULT false
        `);
    await queryRunner.query(`
        CREATE EVENT IF NOT EXISTS check_expired_codes
        ON SCHEDULE EVERY 1 HOUR
        DO
        BEGIN
            UPDATE codes SET isExpired = true 
            WHERE isExpired = false AND expiresAt < NOW();
        END
        `);
    await queryRunner.query(`SET GLOBAL event_scheduler = ON`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP EVENT IF EXISTS check_expired_codes`);
    await queryRunner.query(`
        ALTER TABLE \`codes\` 
        MODIFY COLUMN \`expiresAt\` date NOT NULL
        `);
    await queryRunner.query(`
        ALTER TABLE \`codes\` 
        DROP COLUMN IF EXISTS \`isExpired\`
        `);
  }
}
