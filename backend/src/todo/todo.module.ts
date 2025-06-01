import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { TodoService } from './entities/todo.service';
import { TodoController } from './todo.controller';
import { TeamModule } from '@src/team/team.module';
import { SseModule } from '@src/sse/sse.module';
import { NotificationModule } from '@src/notification/notification.module';
import { UserModule } from '@src/user/user.module';
import { TodoResolver } from './todo.resolver';

@Module({
    imports: [TypeOrmModule.forFeature([Todo]), TeamModule, SseModule,NotificationModule,UserModule],
    providers: [TodoService, TodoResolver],
    controllers: [TodoController],
})
export class TodoModule { }
