import { Subscriber } from 'rxjs';

export interface ConnectedClient {
  userId: number;
  subscriber: Subscriber<{ data: any; event?: string }>;
}
