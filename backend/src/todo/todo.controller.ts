import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    Delete,
    NotFoundException,
    ParseIntPipe,
} from '@nestjs/common';
import { TodoService } from './entities/todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Controller('todos')
export class TodoController {
    constructor(private readonly todoService: TodoService) { }

    @Get()
    findAll(): Promise<Todo[]> {
        return this.todoService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Todo> {
        const todo = await this.todoService.findOne(id);
        if (!todo) throw new NotFoundException(`Todo ${id} not found`);
        return todo;
    }

    @Post()
    create(@Body() dto: CreateTodoDto): Promise<Todo> {
        return this.todoService.create(dto);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateTodoDto,
    ): Promise<Todo> {
        return this.todoService.update(id, dto);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.todoService.delete(id);
    }
}
