import { IsEnum, IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';
import { TodoStatus } from 'src/enum/todo-status.enum';

export class CreateTodoDto {
    @IsString()
    @IsNotEmpty()
    task: string;

    @IsEnum(TodoStatus)
    @IsOptional()
    status?: TodoStatus;

    @IsDateString()
    dueDate: Date;

    @IsNotEmpty()
    userId: number;

    @IsOptional()
    teamId?: number;
}
