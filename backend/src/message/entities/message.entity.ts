import { Timestamp } from "src/common/entities/timestamp.entity";
import { Team } from "src/team/entities/team.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('messages')
export class Message extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content : string

  @ManyToOne(()=>User,user=>user.messages)
  sender : User

  @ManyToOne(()=>Team,team=>team.messages)
  team : Team



}
