import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { TodoService } from './entities/todo.service';
import { Todo } from './entities/todo.entity';
import { TodoStatus } from '@src/enum/todo-status.enum';

@Resolver()
export class TodoResolver {
  constructor(private readonly todoService: TodoService) {}

  @Query(() => [Todo])
  getAllTodos(): Promise<Todo[]> {
    return this.todoService.findAllTodos();
  }
  @Query(() => Todo)
  getOneTodo(@Args('id', { type: () => Int }) id: number) {
    return this.todoService.findOneTodo(id);
  }

  @Query(() => [Todo])
  async getTodoByTeam(
    @Args('teamId', { type: () => Int }) teamId: number,
    @Args('status', { type: () => TodoStatus, nullable: true })
    status?: TodoStatus,
    @Args('userId', { type: () => Int, nullable: true }) userId?: number,
  ): Promise<Todo[]> {
    return this.todoService.findTodoByTeam(teamId, userId, status);
  }
}
