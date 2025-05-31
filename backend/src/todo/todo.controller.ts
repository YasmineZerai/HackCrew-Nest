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
import { Filter } from '@src/common/decorators/filter.decorator';
import { TodoFilterDto } from './dto/filter-todo.dto';
import { ApiResponse } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@Controller('todos')
export class TodoController {
    constructor(private readonly todoService: TodoService) { }


    @Get('team/:teamId')
    @ApiResponse({type:[Todo]})
    async findByTeam(@Param('teamId', ParseIntPipe) teamId: number,
        @Filter() filter: TodoFilterDto): Promise<Todo[]> {
        return this.todoService.findByTeam(teamId, filter)
    }

    @Get('me')
    @ApiResponse({type:[Todo]})
    async findUserTodos(@ConnectedUser('id') userId: number,
        @Filter() filter: TodoFilterDto): Promise<Todo[]> {
        return this.todoService.findByUser(userId, filter);
    }

    @Get('me/team/:teamId')
    @ApiResponse({type:[Todo]})
    async findByUserTeam(
        @Param('teamId', ParseIntPipe) teamId: number,
        @ConnectedUser('id') userId: number,
        @Filter() filter: TodoFilterDto
    ): Promise<Todo[]> {
        return this.todoService.findByUserAndTeam(userId, teamId, filter);
    }

    @Post('team/:teamId')
    @ApiResponse({type:Todo})
    async create(
        @Body() createTodoDto: CreateTodoDto,
        @Param('teamId',ParseIntPipe) teamId : number,
        @ConnectedUser() user: AuthUser,
    ): Promise<Todo> {
        return await this.todoService.createTodo(createTodoDto,teamId,user.id)
    }

    @Patch(':id')
    @ApiResponse({type:Todo})
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateTodoDto: UpdateTodoDto,
        @ConnectedUser('id') userId: number,
    ): Promise<Todo> {

        const existingTodo = await this.todoService.findOne(id);
        const updatedTodo = await this.todoService.update(id, updateTodoDto);

        if (updateTodoDto.status && updateTodoDto.status !== existingTodo.status) {
            await this.todoService.notifyTeamMembersIfNecessary(updatedTodo, updateTodoDto.status, userId);
        }

        return updatedTodo;
    }


    @Delete(':id')
    @ApiResponse({type:Todo})
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<void> {
        await this.todoService.remove(id);
    }
}
