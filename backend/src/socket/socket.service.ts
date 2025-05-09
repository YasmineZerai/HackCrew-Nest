import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { SessionService } from './session/session.service';
import { SendMessageToRoomArgs } from './interfaces/socket-types.interface';
import { UserService } from '@src/user/user.service';

@Injectable()
export class SocketService {
  private server: Server;

  constructor(
    private readonly sessionService: SessionService,
    private readonly userService: UserService,
  ) {}

  setServer(server: Server) {
    this.server = server;
  }
<<<<<<< HEAD

  async handleConnection(client: Socket) {
    try {
      const user = this.sessionService.authenticate(client);
      client.data.user = {
        id: user.id,
        username: user.username,
      };
      this.sessionService.registerSocket(client.id, user.id);
      await this.sessionService.joinTeamsRooms(client, user);
      return user;
    } catch (error) {
      client.emit('auth-error', { message: error.message });
      client.disconnect();
      return null;
    }
  }

  handleDisconnection(client: Socket) {
    const userId = this.sessionService.getUserId(client.id);
    if (userId) {
      this.sessionService.removeSocket(client.id);
    }
  }

  sendToRoom({ client, room, message, event }: SendMessageToRoomArgs) {
    client.to(room).emit(event, message);
  }
  getUser(client: Socket) {
    const userId = this.sessionService.getUserId(client.id);
    if (userId) {
      const user = this.userService.findOne(userId);
      return user;
    }
    return null;
=======
  handleConnection(client: Socket) {
    try {
      const user = this.sessionService.authenticate(client);
      this.sessionService.registerSocket(client.id, user.id);

      console.log('conncted');
    } catch (error) {
      client.emit('auth_error', { message: error.message });
    }
>>>>>>> feature/auth
  }
}
