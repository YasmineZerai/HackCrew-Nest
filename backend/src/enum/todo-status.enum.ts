import { registerEnumType } from "@nestjs/graphql";

export enum TodoStatus {
  TODO = 'todo',
  DOING = 'doing',
  DONE = 'done',
}

registerEnumType(TodoStatus, {
  name: 'TodoStatus',
  description: 'The status of a Todo',
});
