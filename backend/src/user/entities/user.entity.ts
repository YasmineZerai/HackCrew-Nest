import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Timestamp } from 'src/common/entities/timestamp.entity';
import { Membership } from 'src/membership/entities/membership.entity';
import { Message } from 'src/message/entities/message.entity';
import { Notification } from 'src/notification/entities/notification.entity';
import { Profile } from 'src/profile/entities/profile.entity';
import { Ressource } from 'src/ressource/entities/ressource.entity';
import { Todo } from 'src/todo/entities/todo.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User extends Timestamp {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty()
  @Column()
  username: string;
  @ApiProperty()
  @Column()
  firstName : string
  @ApiProperty()
  @Column()
  lastName : string

  @ApiProperty()
  @Column()
  email: string;
  @ApiProperty()
  @Column()
  @Exclude()
  password: string;

  @OneToMany(() => Membership, (membership) => membership.user)
  memberships: Membership[];

  @OneToMany(() => Todo, (todo) => todo.user)
  todos: Todo[];

  @OneToOne(() => Profile, (profile) => profile.user)
  @JoinColumn()
  profile: Profile;

  @OneToMany(() => Ressource, (ressource) => ressource.user)
  @Exclude()
  ressources: Ressource[];

  @OneToMany(() => Notification, (notification) => notification.user)
  @Exclude()
  notifications: Notification[];

  @OneToMany(() => Message, (message) => message.sender)
  @Exclude()
  messages: Message[];
}
