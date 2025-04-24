import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('codes')
export class Code {
    @PrimaryGeneratedColumn()
    id : number
    @Column({type:'date'})
    expiresAt : Date
}