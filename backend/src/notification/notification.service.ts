import { Injectable } from '@nestjs/common';
import { GenericService } from '@src/common/services/generic.service';
import { Notification } from './entities/notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamService } from '@src/team/team.service';
import axios from 'axios';

@Injectable()
export class NotificationService extends GenericService<Notification> {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly teamService: TeamService,
  ) {
    super(notificationRepository);
  }

  async notifyTeam(userId: number, data:any, teamId: number) {
    const team = await this.teamService.findOneBy({ id: teamId }, [
      'memberships',
      'memberships.user',
    ]);

    if (!team?.memberships) return;

    const recipients = team.memberships
      .map((m) => m.user.id)
      .filter((id) => id !== userId)
      .map((id) => id.toString());
    recipients.map((item)=>{
        axios.post('http://localhost:5000/sse/notify-user',{userId:item,data,event:'emergency'}).then((res)=>{console.log('team notified successfully')}).catch((err)=>console.log(err))
        
        })
    }
    

}
