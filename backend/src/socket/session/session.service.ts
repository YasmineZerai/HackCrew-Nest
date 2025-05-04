// sockets.session.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

interface UserSocket {
  userId: string;
  socketId: string;
}

@Injectable()
export class SessionService {
  private connectedUsers: Map<string, string[]> = new Map();
  private socketToUser: Map<string, string> = new Map();

  constructor(private readonly jwtService: JwtService) {}

  authenticate(client: Socket) {
    const token = client.handshake.query.token as string;
    if (!token) {
      throw new WsException('Invalid token');
    }

    const payload = this.jwtService.verify(token);
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
}
