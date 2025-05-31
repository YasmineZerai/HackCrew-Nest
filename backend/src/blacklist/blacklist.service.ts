import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlacklistToken } from './entities/blacklist-token.entity';

@Injectable()
export class BlacklistService {
  constructor(
    @InjectRepository(BlacklistToken)
    private readonly blacklistRepository: Repository<BlacklistToken>,
  ) {}

  async addToken(token: string): Promise<BlacklistToken> {
    const blacklistToken = this.blacklistRepository.create({ token });
    return this.blacklistRepository.save(blacklistToken);
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    if (typeof token !== 'string') {
      console.error('Token is not a string:', token);
      return false;
    }
    const found = await this.blacklistRepository.findOne({ where: { token } });
    return !!found;
  }
}
