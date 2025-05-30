import { ApiProperty } from '@nestjs/swagger';
import { Timestamp } from 'src/common/entities/timestamp.entity';
import { TodoStatus } from 'src/enum/todo-status.enum';
import { Team } from 'src/team/entities/team.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('todos')
export class Todo extends Timestamp {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty()
  @Column()
  task: string;
  @ApiProperty()
  @Column({ type: 'enum', enum: TodoStatus, default: TodoStatus.TODO })
  status: TodoStatus;
  @ApiProperty()
  @Column({ type: 'date' })
  dueDate: Date;
  @ManyToOne(() => User, (user) => user.todos)
  user: User;

  @ManyToOne(() => Team, (team) => team.todos)
  team: Team;
}
