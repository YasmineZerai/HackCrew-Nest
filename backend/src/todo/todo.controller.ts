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
    UseGuards,
} from '@nestjs/common';
import { TodoService } from './entities/todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { JwtAuthGuard } from '@src/auth/guards/jwt.guard';
import { ConnectedUser } from '@src/auth/decorators/user.decorator';
import { AuthUser } from '@src/auth/interfaces/auth.interface';

@UseGuards(JwtAuthGuard)
@Controller('todos')
export class TodoController {
    constructor(private readonly todoService: TodoService) { }

    @Get()
    async findUserTodos(@ConnectedUser('id') userId: number): Promise<Todo[]> {
        return this.todoService.findByUser(userId);
    }

    @Get('team/:teamId')
    async findByTeam(
        @Param('teamId', ParseIntPipe) teamId: number,
        @ConnectedUser('id') userId: number,
    ): Promise<Todo[]> {
        return this.todoService.findByUserAndTeam(userId, teamId);
    }

    @Post()
    async create(
        @Body() createTodoDto: CreateTodoDto,
        @ConnectedUser() user: AuthUser,
    ): Promise<Todo> {
        return this.todoService.create({
            ...createTodoDto,
            user: { id: user.id },
        });
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateTodoDto: UpdateTodoDto,
<<<<<<< HEAD
        @ConnectedUser('id') userId: number,
    ): Promise<Todo> {

        const existingTodo = await this.todoService.findOne(id);
        const updatedTodo = await this.todoService.update(id, updateTodoDto);

        if (updateTodoDto.status && updateTodoDto.status !== existingTodo.status) {
            await this.todoService.notifyTeamMembersIfNecessary(updatedTodo, updateTodoDto.status, userId);
        }

        return updatedTodo;
    }


=======
    ): Promise<Todo> {
        return this.todoService.update(id, updateTodoDto);
    }

>>>>>>> feature/auth
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<void> {
        await this.todoService.remove(id);
    }
}
