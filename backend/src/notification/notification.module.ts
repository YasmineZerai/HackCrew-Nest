import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { Team } from '@src/team/entities/team.entity';
import { TeamModule } from '@src/team/team.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { SseService } from '@src/sse/sse.service';
import { SseModule } from '@src/sse/sse.module';

@Module({
  imports:[TypeOrmModule.forFeature([Notification]),TeamModule,SseModule],
  providers: [NotificationService],
  controllers: [NotificationController]
})
export class NotificationModule {}
