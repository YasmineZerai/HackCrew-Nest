import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import { SocketService } from './socket.service';
import { Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway {
  constructor(private readonly socketService: SocketService) {}

  // async handleConnection(client: Socket) {
  //   await this.socketService.handleConnection(client);
  // }

  async handleDisconnect(client: Socket) {
    this.socketService.handleDisconnection(client);
  }

  @SubscribeMessage('send-message')
  sendMessage() {
    this.socketService.handleMessage();
  }
  @SubscribeMessage('ping')
  ping(client: Socket) {
    throw new WsException('Intentional error');
  }
}
