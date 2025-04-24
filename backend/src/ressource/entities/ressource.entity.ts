import { Team } from "src/team/entities/team.entity";
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

}