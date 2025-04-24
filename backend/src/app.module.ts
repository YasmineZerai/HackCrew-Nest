import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'config/typeorm.config';
import { TeamModule } from './team/team.module';
import { ProfileModule } from './profile/profile.module';
import { RessourceModule } from './ressource/ressource.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: typeOrmConfig,
  }),UserModule, TeamModule, ProfileModule, RessourceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
