import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '@src/auth/guards/jwt.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ConnectedUser } from '@src/auth/decorators/user.decorator';
import axios from 'axios';
import { TeamService } from '@src/team/team.service';


@Controller('notification')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService){}

    @Post('alertTeam/:id')
    async alertTeam(@ConnectedUser() user :any,@Param('id') id :number){
        
        await this.notificationService.notifyTeam(user.id,'this is data',id)

        return 'team members successfully notified'


        
    }





}
