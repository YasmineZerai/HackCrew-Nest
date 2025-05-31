import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Team } from 'src/team/entities/team.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
@ObjectType()
@Entity('ressources')
export class Ressource {
  @ApiProperty()
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty()
  @Field()
  @Column()
  title: string;
  @ApiProperty()
  @Field()
  @Column()
  description: string;
  @ApiProperty()
  @Field({ nullable: true })
  @Column({ nullable: true })
  link: string;
  @ApiProperty()
  @Field({ nullable: true })
  @Column({ nullable: true })
  path: string;
  @Field(() => Team)
  @ManyToOne(() => Team, (team) => team.ressources)
  team: Team;
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.ressources)
  user: User;
}
