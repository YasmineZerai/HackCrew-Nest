import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/entities/user.entity';
import { Team } from 'src/team/entities/team.entity';
import { Profile } from 'src/profile/entities/profile.entity';
import { Ressource } from 'src/ressource/entities/ressource.entity';
import { Todo } from 'src/todo/entities/todo.entity';
import { Membership } from 'src/membership/entities/membership.entity';
import { Code } from 'src/team/entities/code.entity';
import { Notification } from 'src/notification/entities/notification.entity';

export const typeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  entities: [User,Team,Profile,Ressource,Todo,Code,Membership,Notification],
  synchronize: true,
  dropSchema:true,
  autoLoadEntities:true
  
});
