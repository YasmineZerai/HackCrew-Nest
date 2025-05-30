import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('blacklist_token')
export class BlacklistToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 512 })
  @Index({ unique: true })
  token: string;

  @CreateDateColumn({ type: 'timestamp' })
  blacklistedAt: Date;
}

export {};
