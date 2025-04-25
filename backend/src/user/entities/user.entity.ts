import { profile } from "console";
import { Timestamp } from "src/common/timestamp.entity";
import { Membership } from "src/membership/entities/membership.entity";
import { Profile } from "src/profile/entities/profile.entity";
import { Ressource } from "src/ressource/entities/ressource.entity";
import { Todo } from "src/todo/entities/todo.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;
  @Column()
  email : string;
  @Column()
  password : string;
  @Column()
  salt : string
  @OneToMany(()=>Membership,membership=>membership.user)
  memberships : Membership[]

  @OneToMany(()=>Todo,todo=>todo.user)
  todos : Todo[]

  @OneToOne(()=>Profile,profile=>profile.user)
  @JoinColumn()
  profile : Profile

  @OneToMany(()=>Ressource,ressource=>ressource.user)
  ressources : Ressource[]
  


}
