import { IsOptional, IsNumberString, IsIn } from 'class-validator';
import { TodoStatus } from '@src/enum/todo-status.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
export class TodoFilterDto {
  @ApiPropertyOptional({ enum: TodoStatus, enumName: 'TodoStatus' })
  @IsOptional()
  status?: TodoStatus;
}
