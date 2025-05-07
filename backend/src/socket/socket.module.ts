import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
import { SessionService } from './session/session.service';
import { JwtService } from '@nestjs/jwt';
import { TeamModule } from '@src/team/team.module';

@Module({
  providers: [SocketService, SocketGateway, SessionService, JwtService],
  imports: [TeamModule],
})
export class SocketModule {}
