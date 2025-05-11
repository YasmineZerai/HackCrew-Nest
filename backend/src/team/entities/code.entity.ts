import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Team } from './team.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('codes')
export class Code {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty()
  @Column({ type: 'timestamp' })
  expiresAt: Date;
  @ApiProperty()
  @Column({ default: false })
  isExpired: boolean;

  @OneToOne(() => Team, (team) => team.code)
  team: Team;
}
