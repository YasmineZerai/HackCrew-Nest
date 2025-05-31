import { Injectable } from '@nestjs/common';
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

@Injectable()
export class TodoService extends GenericService<Todo> {
    constructor(
        @InjectRepository(Todo)
        private readonly todoRepo: Repository<Todo>,
        private readonly teamService: TeamService,
        private readonly sseService: SseService,
        private readonly notificationService : NotificationService
    ) {
        super(todoRepo);
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

    async findByUserAndTeam(userId: number, teamId: number, filter: TodoFilterDto): Promise<Todo[]> {
        return this.todoRepo.find({
            where: {
                user: { id: userId },
                team: { id: teamId },
                ...filter
            },
        });
    }

    async notifyTeamMembersIfNecessary(todo: Todo, status: TodoStatus, actorId: number) {
        if (![TodoStatus.DOING, TodoStatus.DONE].includes(status) || !todo.team) return;

        const team = await this.teamService.findOneBy(
            { id: todo.team.id },
            ['memberships', 'memberships.user'],
        );

        if (!team?.memberships) return;



        const message = `Todo "${todo.task}" status updated to "${status}".`;
        const event = EventType.UPDATE_TODO

       return  this.notificationService.notifyReceivers(team,actorId,message,message,event)

    }
}
