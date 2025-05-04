import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
import { SessionService } from './session/session.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [SocketService, SocketGateway, SessionService, JwtService],
})
export class SocketModule {}
