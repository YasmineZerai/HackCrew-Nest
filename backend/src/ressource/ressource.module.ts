import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RessourcesController } from './ressource.controller';
import { RessourcesService } from './ressource.service';
import { Ressource } from './entities/ressource.entity';
import { Team } from '../team/entities/team.entity';
import { User } from '../user/entities/user.entity';
import { NotificationModule } from '@src/notification/notification.module';
import { TeamModule } from '@src/team/team.module';
import { UserModule } from '@src/user/user.module';
import { RessourceResolver } from './ressource.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Ressource, Team, User]),NotificationModule,TeamModule,UserModule],
  controllers: [RessourcesController],
  providers: [RessourcesService, RessourceResolver],
})
export class RessourceModule {}
