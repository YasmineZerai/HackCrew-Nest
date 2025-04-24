import { Timestamp } from "src/common/timestamp.entity";
import { Membership } from "src/membership/entities/membership.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('teams')
export class Team extends Timestamp {

    @PrimaryGeneratedColumn()
    id : number;
    @Column()
    name : string;

    @OneToMany(()=>Membership,memebership =>memebership.team)
    memberships : Membership[];


}