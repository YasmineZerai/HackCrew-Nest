import * as mysql from 'mysql2/promise';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { MigrationInterface, QueryRunner } from 'typeorm';

dotenv.config();

const migrationName = process.argv[2];

if (!migrationName) {
  console.error('ERROR: Please provide a migration name as an argument');
  console.log('Example: npm run migration:run:specific AddCodeExpirationCheck');
  process.exit(1);
}

interface SimplifiedQueryRunner extends Partial<QueryRunner> {
  query(query: string, parameters?: any[]): Promise<any>;
  connect(): Promise<void>;
  release(): Promise<void>;
}

interface MigrationModule {
  [key: string]: unknown;
}

type MigrationClassType = new () => MigrationInterface & { name: string };

async function main(): Promise<void> {
  const migrationsDir = path.join(__dirname, '../migrations');
  const migrationFiles = fs.readdirSync(migrationsDir);

  const matchingFile = migrationFiles.find((file) =>
    file.toLowerCase().includes(migrationName.toLowerCase()),
  );

  if (!matchingFile) {
    console.error(`ERROR: No migration file found matching "${migrationName}"`);
    process.exit(1);
  }

  console.log(`Found migration file: ${matchingFile}`);

  const fileContent = fs.readFileSync(
    path.join(migrationsDir, matchingFile),
    'utf8',
  );
  console.log('File content first 200 chars:', fileContent.substring(0, 200));

  const migrationPath = path.join(migrationsDir, matchingFile);
  const migrationModule = (await import(migrationPath)) as MigrationModule;

  console.log('Module keys:', Object.keys(migrationModule));

  let MigrationClass: MigrationClassType | null = null;

  const className = matchingFile
    .replace(/^\d+-/, '')
    .replace(/\.(js|ts)$/, '')
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

  console.log('Looking for class named:', className);

  if (
    migrationModule[className] &&
    typeof migrationModule[className] === 'function' &&
    isValidMigrationClass(migrationModule[className])
  ) {
    MigrationClass = migrationModule[className] as MigrationClassType;
    console.log('Found via direct export');
  } else if (
    migrationModule.default &&
    typeof migrationModule.default === 'function' &&
    isValidMigrationClass(migrationModule.default)
  ) {
    MigrationClass = migrationModule.default as MigrationClassType;
    console.log('Found via default export');
  } else {
    for (const key of Object.keys(migrationModule)) {
      const exportedItem = migrationModule[key];
      if (
        typeof exportedItem === 'function' &&
        isValidMigrationClass(exportedItem)
      ) {
        MigrationClass = exportedItem as MigrationClassType;
        console.log(`Found via examination of export "${key}"`);
        break;
      }
    }
  }

  if (!MigrationClass) {
    console.error('ERROR: Could not find migration class in the file');
    console.log('Available exports:', Object.keys(migrationModule));
    process.exit(1);
  }

  const migration = new MigrationClass();
  console.log(`Executing migration: ${migration.name}`);

  // Connect to database
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true,
  });

  try {
    // Create a minimal QueryRunner for the migration
    const queryRunner: SimplifiedQueryRunner = {
      query: async (sql: string, params?: any[]): Promise<any> => {
        console.log(
          `Executing SQL: ${sql.substring(0, 150)}${sql.length > 150 ? '...' : ''}`,
        );
        return await connection.query(sql, params);
      },
      connect: async (): Promise<void> => {},
      release: async (): Promise<void> => {},
    };

    await connection.query('START TRANSACTION');

    // Execute the migration
    await migration.up(queryRunner as unknown as QueryRunner);

    const timestamp = matchingFile.split('-')[0];

    await connection.query(
      'INSERT INTO migrations (timestamp, name) VALUES (?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name)',
      [timestamp, migration.name],
    );

    await connection.query('COMMIT');

    console.log(`Migration ${migration.name} successfully applied!`);
  } catch (error) {
    await connection.query('ROLLBACK');
    console.error('ERROR executing migration:', error);
  } finally {
    await connection.end();
  }
}

function isValidMigrationClass(value: unknown): boolean {
  if (typeof value !== 'function') return false;

  const constructorFunction = value as {
    prototype?: { up?: unknown; down?: unknown };
  };
  const prototype = constructorFunction.prototype;

  if (!prototype) return false;

  return (
    typeof prototype.up === 'function' && typeof prototype.down === 'function'
  );
}

main().catch(console.error);
