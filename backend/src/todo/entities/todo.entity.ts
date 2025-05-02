import { Timestamp } from 'src/common/entities/timestamp.entity';
import { TodoStatus } from 'src/enum/todo-status.enum';
import { Team } from 'src/team/entities/team.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('todos')
export class Todo extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  task: string;
  @Column({ type: 'enum', enum: TodoStatus, default: TodoStatus.PENDING })
  status: TodoStatus;
  @Column({ type: 'date' })
  dueDate: Date;
  @ManyToOne(() => User, (user) => user.todos)
  user: User;

  @ManyToOne(() => Team, (team) => team.todos)
  team: Team;
}
