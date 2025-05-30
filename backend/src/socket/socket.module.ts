import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
import { SessionService } from './session/session.service';
import { JwtService } from '@nestjs/jwt';
import { TeamModule } from '@src/team/team.module';
import { MessageModule } from '@src/message/message.module';
import { MessageSocketService } from './messages/message-socket.service';
import { UserModule } from '@src/user/user.module';

@Module({
  providers: [
    SocketService,
    SocketGateway,
    SessionService,
    JwtService,
    MessageSocketService,
  ],
  imports: [TeamModule, MessageModule, UserModule],
  exports: [SocketService],
})
export class SocketModule {}
