import { profile } from 'console';
import { Timestamp } from 'src/common/entities/timestamp.entity';
import { Membership } from 'src/membership/entities/membership.entity';
import { Profile } from 'src/profile/entities/profile.entity';
import { Ressource } from 'src/ressource/entities/ressource.entity';
import { Todo } from 'src/todo/entities/todo.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('notifications')
export class Notification extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.notifications)
  user: User;
}
