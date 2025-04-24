import { Timestamp } from "src/common/timestamp.entity";
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('profiles')
export class Profile extends Timestamp{
    @PrimaryGeneratedColumn()
    id : number
    @Column()
    firstName : string
    @Column()
    lastName : string
    @Column()
    picture : string
    @Column()
    phone : string
    @Column()
    location : string
    
}