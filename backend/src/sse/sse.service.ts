import { Injectable } from '@nestjs/common';
import { ConnectedClient } from './interface/connected-client.interface';
import { Observable } from 'rxjs';

@Injectable()
export class SseService {
  private clients: ConnectedClient[] = [];

  connect(userId: number): Observable<{ data: any; event?: string }> {
    return new Observable((subscriber) => {
      const client: ConnectedClient = { userId, subscriber };
      this.clients.push(client);

      subscriber.add(() => {
        this.clients = this.clients.filter((c) => c !== client);
      });
    });
  }

  notifyUser(userId: number, data: any, event: string) {
    for (const client of this.clients) {
      if (client.userId === userId) {
        client.subscriber.next({
          data: JSON.stringify({
            event: event,
            message: data,
          }),
        });
      }
    }
  }

  notifyManyUsers(userIds: number[], data: any, event: string) {
    for (const client of this.clients) {
      if (userIds.includes(client.userId)) {
        client.subscriber.next({
          event,
          data,
        });
      }
    }
  }
}
