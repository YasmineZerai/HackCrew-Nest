import { Timestamp } from 'src/common/entities/timestamp.entity';
import { Membership } from 'src/membership/entities/membership.entity';
import { Todo } from 'src/todo/entities/todo.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Code } from './code.entity';
import { Ressource } from 'src/ressource/entities/ressource.entity';
import { Message } from 'src/message/entities/message.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Int, ObjectType } from '@nestjs/graphql';
@ObjectType()
@Entity('teams')
export class Team extends Timestamp {
  @ApiProperty()
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty()
  @Field()
  @Column()
  name: string;

  @OneToMany(() => Membership, (membership) => membership.team)
  memberships: Membership[];

  @OneToMany(() => Todo, (todo) => todo.team)
  todos: Todo[];

  @OneToOne(() => Code, (code) => code.team)
  @JoinColumn()
  code: Code;
  @Field(() => [Ressource])
  @OneToMany(() => Ressource, (ressource) => ressource.team)
  ressources: Ressource[];

  @OneToMany(() => Message, (message) => message.team)
  messages: Message[];
}
