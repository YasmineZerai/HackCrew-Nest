import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './todo.entity';
import { Repository } from 'typeorm';
import { SharedService } from 'src/common/services/base.service';

@Injectable()
export class TodoService extends SharedService<Todo> {
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
