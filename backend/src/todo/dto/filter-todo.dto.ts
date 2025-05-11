import { IsOptional, IsNumberString, IsIn } from 'class-validator';
import { TodoStatus } from '@src/enum/todo-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class TodoFilterDto {
  @ApiProperty()
  @IsOptional()
  status?: TodoStatus;
}
