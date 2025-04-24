import { Injectable } from '@nestjs/common';
import { ConnectedClient } from './interface/connected-client.interface';
import { Observable } from 'rxjs';

@Injectable()
export class SseService {
    private clients : ConnectedClient[]=[]

    connect(userId: string): Observable<{ data: any; event?: string }> {
        return new Observable((subscriber) => {
          const client: ConnectedClient = { userId,subscriber };
          this.clients.push(client);
    
          subscriber.add(() => {
            this.clients = this.clients.filter(c => c !== client);
          });
        });
      }



}
