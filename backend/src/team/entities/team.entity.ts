import { Timestamp } from "src/common/timestamp.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('teams')
export class Team extends Timestamp {

    @PrimaryGeneratedColumn()
    id : number;
    @Column()
    name : string;


}