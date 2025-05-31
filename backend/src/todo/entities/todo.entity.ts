import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Timestamp } from 'src/common/entities/timestamp.entity';
import { TodoStatus } from 'src/enum/todo-status.enum';
import { Team } from 'src/team/entities/team.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
@ObjectType()
@Entity('todos')
export class Todo extends Timestamp {
  @ApiProperty()
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty()
  @Field()
  @Column()
  task: string;
  @ApiProperty()
  @Field(()=>TodoStatus)
  @Column({ type: 'enum', enum: TodoStatus, default: TodoStatus.TODO })
  status: TodoStatus;
  @ApiProperty()
  @Field(()=>Date)
  @Column({ type: 'date' })
  dueDate: Date;
  @Field(()=>User)
  @ManyToOne(() => User, (user) => user.todos)
  user: User;
  @Field(()=>Team)
  @ManyToOne(() => Team, (team) => team.todos)
  team: Team;
}
