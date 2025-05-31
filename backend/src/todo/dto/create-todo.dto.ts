import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  task: string;
  @ApiProperty()
  @IsEnum(TodoStatus)
  @IsOptional()
  status?: TodoStatus;
  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  dueDate: Date;
}
