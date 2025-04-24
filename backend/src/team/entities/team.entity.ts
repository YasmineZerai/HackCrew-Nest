import { Timestamp } from "src/common/timestamp.entity";
import { Membership } from "src/membership/entities/membership.entity";
import { Todo } from "src/todo/entities/todo.entity";
import {  Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Code } from "./code.entity";

@Entity('teams')
export class Team extends Timestamp {

    @PrimaryGeneratedColumn()
    id : number;
    @Column()
    name : string;

    @OneToMany(()=>Membership,memebership =>memebership.team)
    memberships : Membership[];

    @OneToMany(()=>Todo,todo=>todo.team)
    todos : Todo[]

    @OneToOne(()=>Code,code=>code.team)
    code : Code


}