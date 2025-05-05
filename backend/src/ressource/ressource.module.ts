import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RessourcesController } from './ressource.controller';
import { RessourcesService } from './ressource.service';
import { Ressource } from './entities/ressource.entity';
import { Team } from '../team/entities/team.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ressource, Team, User])],
  controllers: [RessourcesController],
  providers: [RessourcesService],
})
export class RessourceModule {}
