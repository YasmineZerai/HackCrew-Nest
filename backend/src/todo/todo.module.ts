import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { TodoService } from './entities/todo.service';
import { TodoController } from './todo.controller';
<<<<<<< HEAD
import { TeamModule } from '@src/team/team.module';
import { SseModule } from '@src/sse/sse.module';

@Module({
    imports: [TypeOrmModule.forFeature([Todo]), TeamModule, SseModule],
=======

@Module({
    imports: [TypeOrmModule.forFeature([Todo])],
>>>>>>> feature/auth
    providers: [TodoService],
    controllers: [TodoController],
})
export class TodoModule { }
