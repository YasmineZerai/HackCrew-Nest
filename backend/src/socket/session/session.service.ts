// sockets.session.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { JWT_SECRET } from '@src/auth/constants/constants';
import { TeamService } from '@src/team/team.service';
import { User } from '@src/user/entities/user.entity';
import { Socket } from 'socket.io';

interface UserSocket {
  userId: string;
  socketId: string;
}

@Injectable()
export class SessionService {
  private connectedUsers: Map<string, string[]> = new Map();
  private socketToUser: Map<string, string> = new Map();

  constructor(
    private readonly jwtService: JwtService,
    private readonly teamService: TeamService,
  ) {}

  authenticate(client: Socket) {
    const token = client.request.headers.authorization as string;
    if (!token) {
      throw new WsException('Invalid token');
    }

    const payload = this.jwtService.verify(token, { secret: JWT_SECRET });
    console.log(payload.user);
    if (!payload.sub) {
      throw new WsException('Invalid token');
    }

    return { id: payload.sub, username: payload.username };
  }

  registerSocket(socketId: string, userId: string): void {
    this.socketToUser.set(socketId, userId);

    const userSockets = this.connectedUsers.get(userId) || [];
    this.connectedUsers.set(userId, [...userSockets, socketId]);
  }

  removeSocket(socketId: string): void {
    const userId = this.socketToUser.get(socketId);
    if (!userId) return;

    this.socketToUser.delete(socketId);

    const userSockets = this.connectedUsers.get(userId) || [];
    const updatedSockets = userSockets.filter((id) => id !== socketId);

    if (updatedSockets.length === 0) {
      this.connectedUsers.delete(userId);
    } else {
      this.connectedUsers.set(userId, updatedSockets);
    }
  }

  getUserId(socketId: string): string | undefined {
    return this.socketToUser.get(socketId);
  }

  getUserSockets(userId: string): string[] {
    return this.connectedUsers.get(userId) || [];
  }

  isUserOnline(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }
  async joinTeamsRooms(client: Socket, user: { id: number; username: string }) {
    const teams = await this.teamService.getTeamsByUserId(user.id);
    teams.map((team) => {
      client.join(`team_${team.id}`);
      client
        .to(`team_${team.id}`)
        .emit('member_connected', {
          message: `${user.username} is connected`,
          userId: user.id,
        });
    });
  }
}
