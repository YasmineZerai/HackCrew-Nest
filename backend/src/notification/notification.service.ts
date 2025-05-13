import { Injectable } from '@nestjs/common';
import { GenericService } from '@src/common/services/generic.service';
import { Notification } from './entities/notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationService extends GenericService<Notification> {
    constructor(
        @InjectRepository(Notification)
        private readonly notificationRepository: Repository<Notification>,
      ) {
            super(notificationRepository)
    
      }

    
}
