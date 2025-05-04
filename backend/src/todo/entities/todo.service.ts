import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './todo.entity';
import { Repository } from 'typeorm';
import { GenericService } from '@src/common/services/generic.service';

@Injectable()
export class TodoService extends GenericService<Todo> {
    constructor(
        @InjectRepository(Todo)
        private readonly todoRepo: Repository<Todo>,
    ) {
        super(todoRepo);
    }

    async findByUser(userId: number): Promise<Todo[]> {
        return this.todoRepo.find({
            where: { user: { id: userId } },
        });
    }

    async findByTeam(teamId: number): Promise<Todo[]> {
        return this.todoRepo.find({
            where: { team: { id: teamId } },
        });
    }

    async findByUserAndTeam(userId: number, teamId: number): Promise<Todo[]> {
        return this.todoRepo.find({
            where: {
                user: { id: userId },
                team: { id: teamId },
            },
        });
    }
}
