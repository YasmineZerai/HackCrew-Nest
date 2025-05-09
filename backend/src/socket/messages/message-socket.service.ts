import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { MessageService } from '@src/message/message.service';
import { AuthenticatedSocket } from '@src/socket/interfaces/socket-types.interface';
import { SocketService } from '@src/socket/socket.service';
import { TeamService } from '@src/team/team.service';

@Injectable()
export class MessageSocketService {
  constructor(
    private readonly socketService: SocketService,
    private readonly teamService: TeamService,
    private readonly messageService: MessageService,
  ) {}

  async handleTeamMessage(client: AuthenticatedSocket, message: any) {
    const team = await this.teamService.findOne(message.teamId);
    if (team) {
      const isMember = this.teamService.isMember(team, client.data.user.id);
      if (isMember) {
        this.socketService.sendToRoom({
          client,
          room: `team_${message.teamId}`,
          message: {
            ...message,
            sender: client.data.user,
            timestamp: new Date(),
          },
          event: 'recieve-team-message',
        });
        const user = await this.socketService.getUser(client);
        if (user) {
          this.messageService.createMessage(user, {
            content: message.content,
            teamId: message.teamId,
          });
          return { success: true };
        }
      }
    }

    throw new WsException('Invalid Team');
  }
}
