import { Injectable } from '@nestjs/common';
import { GenericService } from '@src/common/services/generic.service';
import { Notification } from './entities/notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamService } from '@src/team/team.service';

@Injectable()
export class NotificationService extends GenericService<Notification> {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly teamService: TeamService,
  ) {
    super(notificationRepository);
  }

  async notifyTeam(userId: number, body: {}, teamId: number) {
    const team = await this.teamService.findOneBy({ id: teamId }, [
      'memberships',
      'memberships.user',
    ]);

    if (!team?.memberships) return;

    const recipients = team.memberships
      .map((m) => m.user.id)
      .filter((id) => id !== userId)
      .map((id) => id.toString());
    }
    
}
