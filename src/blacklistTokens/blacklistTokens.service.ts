import { Injectable } from '@nestjs/common';
import { BlacklistTokensRepository } from './blacklistTokens.repository';

@Injectable()
export class BlacklistTokensService {
  constructor(
    private readonly blacklistTokensRepository: BlacklistTokensRepository,
  ) {}

  async addToken(token: string): Promise<void> {
    return await this.blacklistTokensRepository.addToken(token);
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    return await this.blacklistTokensRepository.isTokenBlacklisted(token);
  }

  async updateLastActivity(token: string) {
    return await this.blacklistTokensRepository.updateLastActivity(token);
  }
}
