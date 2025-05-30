import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RessourcesController } from './ressource.controller';
import { RessourcesService } from './ressource.service';
import { Ressource } from './entities/ressource.entity';
import { Team } from '../team/entities/team.entity';
import { User } from '../user/entities/user.entity';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig, fileFilter } from '@src/ressource/multer.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ressource, Team, User]),
    MulterModule.register({
      storage: multerConfig.storage,
      fileFilter: fileFilter,
    }),
  ],
  controllers: [RessourcesController],
  providers: [RessourcesService, MulterModule],
})
export class RessourceModule {}
