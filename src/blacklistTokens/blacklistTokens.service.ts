import { Injectable } from '@nestjs/common';
import { BlacklistTokensRepository } from './blacklistTokens.repository';

@Injectable()
export class BlacklistTokensService {
  constructor(private readonly dbQuery: BlacklistTokensRepository) {}

  async addToken(token: string): Promise<void> {
    return await this.dbQuery.addToken(token);
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    return await this.dbQuery.isTokenBlacklisted(token);
  }
}
