import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlacklistToken } from './entities/blacklist-token.entity';
import { BlacklistService } from './blacklist.service';

@Module({
  imports: [TypeOrmModule.forFeature([BlacklistToken])],
  providers: [BlacklistService],
  exports: [BlacklistService],
})
export class BlacklistModule {}
