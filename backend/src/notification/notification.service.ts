import { Injectable, NotFoundException } from '@nestjs/common';
import { GenericService } from '@src/common/services/generic.service';
import { Notification } from './entities/notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamService } from '@src/team/team.service';
import axios from 'axios';
import { SseService } from '@src/sse/sse.service';
import { AlertDto } from './dto/alert.dto';
import { UserService } from '@src/user/user.service';
import { Team } from '@src/team/entities/team.entity';
import { User } from '@src/user/entities/user.entity';
import { EventType } from '@src/enum/event-type.enum';

@Injectable()
export class NotificationService extends GenericService<Notification> {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly teamService: TeamService,
    private readonly sseService: SseService,
    private readonly userService: UserService,
  ) {
    super(notificationRepository);
  }

  // async notifyTeam(userId: number, data: AlertDto, teamId: number) {
  //   const team = await this.teamService.findOne(teamId);
  //   return this.notifyReceivers(
  //     team,
  //     userId,
  //     data.message,
  //     data.message,
  //     EventType.TEAM_ALERT,
  //   );
  // }
    async notifyTeam(userId: number, data: any,message:string,event:EventType, teamId: number) {
    const team = await this.teamService.findOne(teamId);
    return this.notifyReceivers(
      team,
      userId,
      data,
      message,
      event,
    );
  }

  async createNotification(
    receiverId: number,
    content: string,
  ): Promise<Notification> {
    const user = await this.userService.findOne(receiverId);
    if (!user) {
      throw new NotFoundException(`user with ID ${receiverId} does not exist`);
    }
    return await this.create({ content, user: user });
  }

  notifyReceivers(
    team: Team,
    userId: number,
    data: any,
    message: string,
    event: string,
  ) {
    const receiversIds = team.memberships
      .filter((membership) => membership.user.id !== userId)
      .map((membership) => membership.user.id);

    if (receiversIds.length === 0) return;

    receiversIds.map(async (item) => {
      this.sseService.notifyUser(
        item,
        {
          data,
          senderId: userId,
          teamId: team.id,
        },
        event,
      );

      await this.createNotification(item, message);
    });
  }
}
