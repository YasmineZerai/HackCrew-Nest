import { forwardRef, Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { Team } from '@src/team/entities/team.entity';
import { TeamModule } from '@src/team/team.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { SseService } from '@src/sse/sse.service';
import { SseModule } from '@src/sse/sse.module';
import { UserModule } from '@src/user/user.module';

@Module({
  imports:[TypeOrmModule.forFeature([Notification]),forwardRef(() => TeamModule),SseModule,UserModule],
  providers: [NotificationService],
  controllers: [NotificationController],
  exports:[NotificationService]
})
export class NotificationModule {}
