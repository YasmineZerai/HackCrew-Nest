import { Team } from "src/team/entities/team.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('ressources')
export class Ressource {

    @PrimaryGeneratedColumn()
    id:number
    @Column()
    description : string
    @Column({nullable:true})
    link : string
    @Column({nullable:true})
    path : string

    @ManyToOne(()=>Team,team=>team.ressources)
    team : Team

    @ManyToOne(()=>User,user=>user.ressources)
    user:User

}