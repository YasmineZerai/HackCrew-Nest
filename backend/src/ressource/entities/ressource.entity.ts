import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

}