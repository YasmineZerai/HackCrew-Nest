import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './todo.entity';
import { Repository } from 'typeorm';
import { SharedService } from 'src/common/services/base.service';

@Injectable()
export class TodoService extends SharedService<Todo> {
    constructor(
        @InjectRepository(Todo)
        private readonly todoRepository: Repository<Todo>,
    ) {
        super(todoRepository);
    }
}
