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
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { TodoService } from './entities/todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Controller('todos')
export class TodoController {
    constructor(private readonly todoService: TodoService) { }

    @Get()
    async findAll(): Promise<Todo[]> {
        return this.todoService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Todo> {
        const todo = await this.todoService.findOne(id);
        if (!todo) {
            throw new NotFoundException(`Todo with id ${id} not found`);
        }
        return todo;
    }

    @Get('user/:userId')
    async findByUser(@Param('userId', ParseIntPipe) userId: number): Promise<Todo[]> {
        return this.todoService.findByUser(userId);
    }

    @Get('team/:teamId')
    async findByTeam(@Param('teamId', ParseIntPipe) teamId: number): Promise<Todo[]> {
        return this.todoService.findByTeam(teamId);
    }

    @Get('user/:userId/team/:teamId')
    async findByUserAndTeam(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('teamId', ParseIntPipe) teamId: number,
    ): Promise<Todo[]> {
        return this.todoService.findByUserAndTeam(userId, teamId);
    }

    @Post()
    async create(@Body() createTodoDto: CreateTodoDto): Promise<Todo> {
        return this.todoService.create(createTodoDto);
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateTodoDto: UpdateTodoDto,
    ): Promise<Todo> {
        return this.todoService.update(id, updateTodoDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        await this.todoService.remove(id);
    }
}
