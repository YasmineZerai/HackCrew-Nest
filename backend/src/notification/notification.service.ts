import { Injectable } from '@nestjs/common';
import { GenericService } from '@src/common/services/generic.service';
import { Notification } from './entities/notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeamService } from '@src/team/team.service';
import axios from 'axios';
import { SseService } from '@src/sse/sse.service';
import { AlertDto } from './dto/alert.dto';

@Injectable()
export class NotificationService extends GenericService<Notification> {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly teamService: TeamService,
    private readonly sseService : SseService
  ) {
    super(notificationRepository);
  }

  async notifyTeam(userId: number, data:AlertDto, teamId: number) {
    const team=await this.teamService.findOne(teamId)
    const memberships=team.memberships
    if (!memberships) return;
    const recipients = memberships
      .map((m) => m.user.id)
      .filter((id) => id !== userId)
    recipients.map((item)=>{
        axios.post('http://localhost:5000/sse/notify-user',{userId:item,data:data.message,event:data.event}).then((res)=>{console.log('team notified successfully')}).catch((err)=>console.log(err))
        
        })
    }
    

}
