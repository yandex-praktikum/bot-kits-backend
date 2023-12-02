import { Bot } from './schema/bots.schema';
import { ConflictException, Injectable } from '@nestjs/common';
import { CreateBotDto } from './dto/create-bot.dto';
import { UpdateBotDto } from './dto/update-bot.dto';
import { ShareBotDto } from './dto/share-bot.dto';
import { BotsRepository } from './bots.repository';

@Injectable()
export class BotsService {
  constructor(private dbQuery: BotsRepository) {}

  async create(profile, createBotDto: CreateBotDto): Promise<Bot> {
    try {
      return await this.dbQuery.create(profile, createBotDto);
    } catch (e) {
      if (e.code === 11000) {
        throw new ConflictException('Бот с таким имененм уже существует');
      }
    }
  }

  async findOne(id: string): Promise<Bot> {
    return await this.dbQuery.findOne(id);
  }

  async findAllByUser(userId: string): Promise<Bot[] | null> {
    return this.dbQuery.findAllByUser(userId);
  }

  async findAll(): Promise<Bot[]> {
    return await this.dbQuery.findAll();
  }

  async findAllTemplates(): Promise<Bot[]> {
    return await this.dbQuery.findAllTemplates();
  }

  async update(
    userId: string,
    id: string,
    updateBotDto: UpdateBotDto,
  ): Promise<Bot> {
    return this.dbQuery.update(userId, id, updateBotDto);
  }

  async remove(userId: string, id: string): Promise<Bot> {
    return await this.dbQuery.remove(userId, id);
  }

  async share(
    profile: string,
    id: string,
    shareBotDto: ShareBotDto,
  ): Promise<string> {
    return await this.dbQuery.share(profile, id, shareBotDto);
  }

  async addBotTemplate(createBotDto: CreateBotDto): Promise<Bot> {
    try {
      return await this.dbQuery.createTemplate(createBotDto);
    } catch (e) {
      if (e.code === 11000) {
        throw new ConflictException('Шаблон с таким имененм уже существует');
      }
    }
  }
}
