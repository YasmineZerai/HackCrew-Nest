import { Subscriber } from 'rxjs';

export interface ConnectedClient {
  userId: string;
  subscriber: Subscriber<{ data: any; event?: string }>;
}
