import { Timestamp } from "src/common/timestamp.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('user')
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


}
