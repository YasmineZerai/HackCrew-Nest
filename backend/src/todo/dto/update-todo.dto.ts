import { PartialType } from '@nestjs/mapped-types';
import { CreateTodoDto } from './create-todo.dto';
import { ApiProperty } from '@nestjs/swagger';
import { TodoStatus } from '@src/enum/todo-status.enum';
import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateTodoDto {
      @ApiProperty()
      @IsString()
      @IsNotEmpty()
      task: string;
      @ApiProperty()
      @IsEnum(TodoStatus)
      @IsOptional()
      status?: TodoStatus;
      @ApiProperty()
      @IsDateString()
      @Type(() => Date)
      dueDate: Date;
      @ApiProperty()
      @IsOptional()
      @IsNumber()
      @Min(1)
      @Type(() => Number)
      teamId?: number
 }
