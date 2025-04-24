import { Column, Entity, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Team } from "./team.entity";

@Entity('codes')
export class Code {
    @PrimaryGeneratedColumn()
    id : number
    @Column({type:'date'})
    expiresAt : Date
    @OneToOne(()=>Team,team=>team.code)
    team : Team
}