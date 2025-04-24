import { Timestamp } from "src/common/timestamp.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

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

    @OneToOne(()=>User,user=>user.profile)
    user : User
}