import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '@src/user/entities/user.entity';
import { Team } from '@src/team/entities/team.entity';
import { Profile } from '@src/profile/entities/profile.entity';
import { Ressource } from '@src/ressource/entities/ressource.entity';
import { Todo } from '@src/todo/entities/todo.entity';
import { Membership } from '@src/membership/entities/membership.entity';
import { Code } from '@src/team/entities/code.entity';
import { Notification } from '@src/notification/entities/notification.entity';
import { Message } from '@src/message/entities/message.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

// Load .env file
config();

export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  entities: [
    User,
    Team,
    Profile,
    Ressource,
    Todo,
    Code,
    Membership,
    Notification,
    Message,
  ],
  // migrations: [join(__dirname, '../../migrations', '*.{ts,js}')],
  synchronize: true,
  // logging: ['error', 'warn'],
  // logger: 'simple-console',
  // migrationsRun: false,
});

// const dataSource = new DataSource({
//   type: 'mysql',
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   username: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   entities: [
//     User,
//     Team,
//     Profile,
//     Ressource,
//     Todo,
//     Code,
//     Membership,
//     Notification,
//     Message,
//   ],
//   migrations: [join(__dirname, '../../migrations', '*.{ts,js}')],
//   synchronize: false,
//   logging: ['error', 'warn'],
//   logger: 'simple-console',
// } as DataSourceOptions);

// export default dataSource;
