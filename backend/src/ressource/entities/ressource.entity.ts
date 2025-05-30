import { ApiProperty } from '@nestjs/swagger';
import { Team } from 'src/team/entities/team.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ressources')
export class Ressource {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty()
  @Column()
  title: string;
  @ApiProperty()
  @Column()
  description: string;
  @ApiProperty()
  @Column({ nullable: true })
  link: string;
  @ApiProperty()
  @Column({ nullable: true })
  path: string;

  @ManyToOne(() => Team, (team) => team.ressources)
  team: Team;

  @ManyToOne(() => User, (user) => user.ressources)
  user: User;
}
