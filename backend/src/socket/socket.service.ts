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
    // try {
    //   const user = await this.sessionService.authenticate(client);
    //   this.sessionService.registerSocket(client.id, user.id);
    // } catch (error) {
    //   client.emit('auth_error', { message: error.message });
    // }
    const user = this.sessionService.authenticate(client);
  }
  handleDisconnection(client: Socket) {}
  handleMessage() {}
}
