import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Team } from './team.entity';

@Entity('codes')
export class Code {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ default: false })
  isExpired: boolean;

  @OneToOne(() => Team, (team) => team.code)
  team: Team;
}
