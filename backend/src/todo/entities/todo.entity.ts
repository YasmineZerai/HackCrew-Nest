import { Timestamp } from "src/common/timestamp.entity";
import { TodoStatus } from "src/enum/todo-status.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('todos')
export class Todo extends Timestamp {
    @PrimaryGeneratedColumn()
    id : number
    @Column()
    task : string
    @Column({type:'enum',enum:TodoStatus,default:TodoStatus.PENDING})
    status : TodoStatus
    @Column({type:Date})
    dueDate : Date
}