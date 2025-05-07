import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from './socket.service';
import { SessionService } from './session/session.service';
import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { WsExceptionFilter } from './socket.filters';
import {
  ChatMessage,
  ChatMessageSchema,
} from 'src/core/zod-schemas/chatMessage.schemas';
import { WsZodPipe } from 'src/core/pipes/ws-zod-validation.pipes';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UseFilters(new WsExceptionFilter())
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly socketService: SocketService,
    private readonly sessionService: SessionService,
  ) {}

  afterInit(server: Server) {
    this.socketService.setServer(server);
    console.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    try {
      const user = this.sessionService.authenticate(client);
      this.sessionService.registerSocket(client.id, user.id);
      this.sessionService.joinTeamsRooms(client, user);
      console.log(`Client connected: ${user.username} (${client.id})`);
    } catch (error) {
      client.emit('auth_error', error);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = this.sessionService.getUserId(client.id);
    if (userId) {
      this.sessionService.removeSocket(client.id);
      console.log(`Client disconnected: ${userId} (${client.id})`);
    }
  }

  @SubscribeMessage('send-message')
  @UsePipes(new WsZodPipe(ChatMessageSchema))
  sendMessageToTeam(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: ChatMessage,
  ) {
    this.socketService.sendMessageToRoom({
      client: client,
      room: `team_${message.teamId}`,
      message: message,
      event: 'recieve-message',
    });
  }
}
