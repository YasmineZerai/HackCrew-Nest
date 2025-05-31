import { Field, Int, ObjectType } from '@nestjs/graphql';
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
@ObjectType()
@Entity('users')
export class User extends Timestamp {
  @ApiProperty()
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty()
  @Field()
  @Column()
  username: string;
  @ApiProperty()
  @Field()
  @Column()
  firstName: string;
  @ApiProperty()
  @Field()
  @Column()
  lastName: string;

  @ApiProperty()
  @Field()
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
  @Field(() => [Ressource])
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
