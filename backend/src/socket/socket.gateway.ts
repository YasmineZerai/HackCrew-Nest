import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { UseFilters, UsePipes } from '@nestjs/common';
import { WsExceptionFilter } from './socket.filters';
import { SocketService } from './socket.service';
import { WsZodPipe } from '@src/core/pipes/ws-zod-validation.pipes';
import {
  ChatMessage,
  ChatMessageSchema,
} from '@src/core/zod-schemas/chatMessage.schemas';
import { AuthenticatedSocket } from './interfaces/socket-types.interface';
import { MessageSocketService } from './messages/message-socket.service';

@WebSocketGateway({
  cors: { origin: '*' },
})
@UseFilters(new WsExceptionFilter())
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly socketService: SocketService,
    private readonly messageSocketService: MessageSocketService,
  ) {}

  afterInit(server: Server) {
    this.socketService.setServer(server);
  }

  handleConnection(client: Socket) {
    this.socketService.handleConnection(client);
  }

  handleDisconnect(client: Socket) {
    this.socketService.handleDisconnection(client);
  }
  @SubscribeMessage('send-message-to-team')
  @UsePipes(new WsZodPipe(ChatMessageSchema))
  async handleTeamMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() message: ChatMessage,
  ) {
    return await this.messageSocketService.handleTeamMessage(client, message);
  }
}
