import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './todo.entity';
import { Repository } from 'typeorm';
import { GenericService } from '@src/common/services/generic.service';
import { TeamService } from '@src/team/team.service';
import { SseService } from '@src/sse/sse.service';
import { TodoStatus } from '@src/enum/todo-status.enum';
import { TodoFilterDto } from '../dto/filter-todo.dto';
import { NotificationService } from '@src/notification/notification.service';
import { UserService } from '@src/user/user.service';
import { EventType } from '@src/enum/event-type.enum';
import { CreateTodoDto } from '../dto/create-todo.dto';

@Injectable()
export class TodoService extends GenericService<Todo> {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepo: Repository<Todo>,
    private readonly teamService: TeamService,
    private readonly userService: UserService,
    private readonly sseService: SseService,
    private readonly notificationService: NotificationService,
  ) {
    super(todoRepo);
  }

  async createTodo(
    createTodoDto: CreateTodoDto,
    teamId: number,
    userId: number,
  ) {
    const newTodo = await this.create(createTodoDto);
    const team = await this.teamService.findOne(teamId);
    const user = await this.userService.findOne(userId);
    if (!user || !team) {
      throw new NotFoundException();
    }
    newTodo.user = user;
    newTodo.team = team;
    const message = `Todo "${newTodo.task}" is created by "${user.username}" .`;
    const data = { newTodo: newTodo };
    const event = EventType.NEW_TODO;
    this.notificationService.notifyReceivers(
      team,
      userId,
      data,
      message,
      event,
    );
    return await this.todoRepo.save(newTodo);
  }

  async findByUser(userId: number, filter: TodoFilterDto): Promise<Todo[]> {
    return this.todoRepo.find({
      where: { user: { id: userId }, ...filter },
    });
  }

  async findByTeam(teamId: number, filter): Promise<Todo[]> {
    return this.todoRepo.find({
      where: { team: { id: teamId }, ...filter },
    });
  }

  async findByUserAndTeam(
    userId: number,
    teamId: number,
    filter: TodoFilterDto,
  ): Promise<Todo[]> {
    return this.todoRepo.find({
      where: {
        user: { id: userId },
        team: { id: teamId },
        ...filter,
      },
    });
  }

  async notifyTeamMembersIfNecessary(
    todo: Todo,
    status: TodoStatus,
    actorId: number,
  ) {
    const team = await this.teamService.findOne(todo.team.id);
    if (!team?.memberships) return;
    const message = `Todo "${todo.task}" status updated to "${status}".`;
    const event =
      status == TodoStatus.DOING ? EventType.DOING_TODO : EventType.DONE_TODO;
    const data = { updatedTodo: todo };
    return this.notificationService.notifyReceivers(
      team,
      actorId,
      data,
      message,
      event,
    );
  }

  async findAllTodos(): Promise<Todo[]> {
    return this.todoRepo.find({
      relations: ['user', 'team'],
    });
  }
  async findOneTodo(id: number) {
    return this.todoRepo.findOne({
      where: { id },
      relations: ['user', 'team'],
    });
  }
  async findTodoByTeam(
    teamId: number,
    userId?: number,
    status?: TodoStatus,
  ): Promise<Todo[]> {
    const where: any = {
      team: { id: teamId },
    };

    if (status) {
      where.status = status;
    }
    if (userId) {
      where.user = { id: userId };
    }

    return this.todoRepo.find({
      where,
      relations: ['team', 'user'],
    });
  }
}
