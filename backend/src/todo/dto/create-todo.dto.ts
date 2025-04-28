import { Type } from 'class-transformer';
import {
    IsDate,
    IsDateString,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';
import { TodoStatus } from 'src/enum/todo-status.enum';

export class CreateTodoDto {
    @IsString()
    @IsNotEmpty()
    task: string;

    @IsEnum(TodoStatus)
    @IsOptional()
    status?: TodoStatus;

    @IsDateString()
    @Type(() => Date)
    dueDate: Date;

    @IsNumber()
    @Min(1)
    @Type(() => Number)
    userId: number;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    teamId?: number;
}
