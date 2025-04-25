import { Timestamp } from "src/common/entities/timestamp.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('messages')
export class Notification extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content : string
  


}
