import { Injectable } from '@nestjs/common';
import { Account } from './schema/account.schema';
import { AccountsRepository } from './accounts.repository';

@Injectable()
export class AccountsService {
  constructor(private readonly dbQuery: AccountsRepository) {}

  async create(account, profile, session?): Promise<Account> {
    return this.dbQuery.create(account, profile, session);
  }

  async findAll(): Promise<Account[]> {
    return this.dbQuery.findAll();
  }

  async findOne(id: string): Promise<Account> {
    return this.dbQuery.findOne(id);
  }

  async update(id, updateAccountDto, session?): Promise<Account> {
    return await this.dbQuery.update(id, updateAccountDto, session);
  }

  async findByEmail(email, session?): Promise<Account | null> {
    return this.dbQuery.findByEmail(email, session);
  }

  async findByEmailAndType(
    email,
    typeAccount,
    session?,
  ): Promise<Account | null> {
    return await this.dbQuery.findByEmailAndType(email, typeAccount, session);
  }

  async findByIdAndProvider(id, provider): Promise<Account> {
    return await this.dbQuery.findByIdAndProvider(id, provider);
  }

  async findAndDeleteRefreshToken(refreshToken) {
    return await this.dbQuery.findAndDeleteRefreshToken(refreshToken);
  }

  async remove(id): Promise<Account> {
    return await this.dbQuery.remove(id);
  }

  async saveRefreshToken(profileId, tokens) {
    return await this.dbQuery.saveRefreshToken(profileId, tokens);
  }
}
