import { IsOptional, IsNumberString, IsIn } from 'class-validator';
import { TodoStatus } from '@src/enum/todo-status.enum';

export class TodoFilterDto {

    @IsOptional()
    status?: TodoStatus;
}
