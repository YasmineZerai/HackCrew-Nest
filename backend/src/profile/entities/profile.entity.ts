import { Timestamp } from 'src/common/entities/timestamp.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('profiles')
export class Profile extends Timestamp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  picture: string;

  @Column()
  phoneNumber: string;

  @Column()
  location: string;

  @OneToOne(() => User, (user) => user.profile)
  user: User;
}