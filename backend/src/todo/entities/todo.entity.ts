import { Timestamp } from "src/common/timestamp.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('todos')
export class Todo extends Timestamp {
    @PrimaryGeneratedColumn()
    id : number
    @Column()
    task : string
    @Column()
    status : string
    @Column({type:Date})
    dueDate : Date
}