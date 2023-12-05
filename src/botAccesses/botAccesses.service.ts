import { Injectable } from '@nestjs/common';
import { BotAccess, Permission } from './shema/botAccesses.shema';
import { ProfilesService } from '../profiles/profiles.service';
import { CreateBotAccessDto } from './dto/create-bot-access.dto';
import { UpdateBotAccessDto } from './dto/update-bot-access.dto';
import { ShareBotAccessDto } from './dto/share-bot-access.dto';
import { BotAccessesRepository } from './botAccesses.repository';

@Injectable()
export class BotAccessesService {
  constructor(
    private readonly dbQuery: BotAccessesRepository,
    private readonly profileService: ProfilesService,
  ) {}

  async create(
    userId,
    createBotAccessDto: CreateBotAccessDto,
  ): Promise<BotAccess> {
    return await this.dbQuery.create(userId, createBotAccessDto);
  }

  async findOne(id): Promise<BotAccess> {
    return await this.dbQuery.findOne(id);
  }

  async delete(ownerId: string, botAccessId: string): Promise<BotAccess> {
    return await this.dbQuery.delete(ownerId, botAccessId);
  }

  async findOneByUserAndBotIds(userId, botId): Promise<BotAccess> {
    return await this.dbQuery.findOneByUserAndBotIds(userId, botId);
  }

  async findAll(): Promise<BotAccess[]> {
    return await this.dbQuery.findAll();
  }

  async getPermission(userId, botId): Promise<Permission> {
    return await this.dbQuery.getPermission(userId, botId);
  }

  async hasFullAccess(userId, botId): Promise<boolean> {
    return await this.dbQuery.hasFullAccess(userId, botId);
  }

  async updateAccess(
    ownerId,
    botAccessId,
    updateBotAccessDto: UpdateBotAccessDto,
  ): Promise<BotAccess> {
    return await this.dbQuery.updateAccess(
      ownerId,
      botAccessId,
      updateBotAccessDto,
    );
  }

  async shareAccess(
    ownerId,
    botId,
    shareBotAccessDto: ShareBotAccessDto,
  ): Promise<BotAccess> {
    return await this.dbQuery.shareAccess(ownerId, botId, shareBotAccessDto);
  }
}
