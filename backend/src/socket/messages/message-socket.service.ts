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
    let team;
    try {
      team = await this.teamService.findOne(message.teamId);
    } catch (error) {
      throw new WsException('invalid team');
    }
    if (!team) {
      throw new WsException('invalid Team');
    }
    if (team) {
      const isMember = this.teamService.isMember(team, client.data.user.id);
      if (isMember) {
        const user = await this.socketService.getUser(client);
        if (user) {
          const newMessage = await this.messageService.createMessage(user, {
            content: message.content,
            teamId: message.teamId,
          });
          if (newMessage)
            this.socketService.sendToRoom({
              client,
              room: `team_${message.teamId}`,
              message: {
                ...message,
                id: newMessage.id,
                sender: client.data.user,
                timestamp: new Date(),
              },
              event: 'recieve-team-message',
            });
          return { success: true };
        }
      }
    }
    throw new WsException('Invalid Team');
  }
}
