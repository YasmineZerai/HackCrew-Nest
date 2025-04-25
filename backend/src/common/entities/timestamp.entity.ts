// src/common/entities/timestamp.entity.ts
import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class Timestamp {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt : Date
}
