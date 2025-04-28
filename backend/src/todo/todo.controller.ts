import { Controller, Get, Post, Body, Param, Patch, Delete, NotFoundException } from '@nestjs/common';
import { TodoService } from './entities/todo.service';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller('todos')
export class TodoController {
    constructor(private readonly todoService: TodoService) { }

    @Get()
    async findAll(): Promise<Todo[]> {
        return this.todoService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Todo> {
        const todo = await this.todoService.findOne(Number(id));
        if (!todo) {
            throw new NotFoundException(`Todo with id ${id} not found`);
        }
        return todo;
    }

    @Post()
    async create(@Body() createTodoDto: CreateTodoDto): Promise<Todo> {
        return this.todoService.create(createTodoDto);
    }

    @Patch(':id')
    async update(@Param('id') id: number, @Body() updateTodoDto: UpdateTodoDto): Promise<Todo> {
        return this.todoService.update(Number(id), updateTodoDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: number): Promise<void> {
        return this.todoService.delete(Number(id));
    }
}
