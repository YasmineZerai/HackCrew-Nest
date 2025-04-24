import { CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('memberships')
export class Membership{
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  joinedAt : Date


}