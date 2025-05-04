import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { SessionService } from './session/session.service';

@Injectable()
export class SocketService {
  private server: Server;
  constructor(private readonly sessionService: SessionService) {}
  setServer(server: Server) {
    this.server = server;
  }
  handleConnection(client: Socket) {
    try {
      const user = this.sessionService.authenticate(client);
      this.sessionService.registerSocket(client.id, user.id);

      console.log('conncted');
    } catch (error) {
      client.emit('auth_error', { message: error.message });
    }
  }
  handleDisconnection(client: Socket) {}
  handleMessage() {}
}
