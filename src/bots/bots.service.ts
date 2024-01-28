import { Bot } from './schema/bots.schema';
import { ConflictException, Injectable } from '@nestjs/common';
import { CreateBotDto } from './dto/create-bot.dto';
import { UpdateBotDto } from './dto/update-bot.dto';
import { ShareBotDto } from './dto/share-bot.dto';
import { BotsRepository } from './bots.repository';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { CopyBotDto } from './dto/copy-bot.dto';
import { PureAbility } from '@casl/ability';
import { Profile } from 'src/profiles/schema/profile.schema';

@Injectable()
export class BotsService {
  constructor(private dbQuery: BotsRepository) {}

  async create(
    profile,
    createBotDto: CreateBotDto,
    ability: PureAbility,
    id?: string,
  ): Promise<Bot> {
    try {
      return await this.dbQuery.create(profile, createBotDto, ability, id);
    } catch (e) {
      if (e.code === 11000) {
        throw new ConflictException('Бот с таким имененм уже существует');
      } else {
        return e;
      }
    }
  }

  async findOne(id: string): Promise<Bot> {
    try {
      return await this.dbQuery.findOne(id);
    } catch (e) {
      return e;
    }
  }

  async findOneBotWithAccess(id: string, userId: Profile): Promise<Bot> {
    try {
      return await this.dbQuery.findOneBotWithAccess(id, userId);
    } catch (e) {
      return e;
    }
  }

  async findAllByUser(userId: string): Promise<Bot[] | null> {
    try {
      return this.dbQuery.findAllByUserNew(userId);
    } catch (e) {
      return e;
    }
  }

  async findAll(): Promise<Bot[]> {
    try {
      return await this.dbQuery.findAll();
    } catch (e) {
      return e;
    }
  }

  async findAllTemplates(): Promise<Bot[]> {
    try {
      return await this.dbQuery.findAllTemplates();
    } catch (e) {
      return e;
    }
  }

  async update(
    botId: string,
    updateBotDto: UpdateBotDto,
    ability: PureAbility,
  ): Promise<Bot> {
    try {
      return this.dbQuery.update(botId, updateBotDto, ability);
    } catch (e) {
      if (e.code === 11000) {
        throw new ConflictException('Бот с таким имененм уже существует');
      } else {
        return e;
      }
    }
  }

  async remove(userId: string, id: string, ability: PureAbility): Promise<Bot> {
    try {
      return await this.dbQuery.remove(userId, id, ability);
    } catch (e) {
      return e;
    }
  }

  async share(
    profile: string,
    id: string,
    shareBotDto: ShareBotDto,
  ): Promise<string> {
    try {
      return await this.dbQuery.share(profile, id, shareBotDto);
    } catch (e) {
      return e;
    }
  }

  async addBotTemplate(createTemplateDto: CreateTemplateDto): Promise<Bot> {
    try {
      return await this.dbQuery.createTemplate(createTemplateDto);
    } catch (e) {
      if (e.code === 11000) {
        throw new ConflictException('Шаблон с таким имененм уже существует');
      } else {
        return e;
      }
    }
  }

  async updateTemplate(
    templateId: string,
    updateTemplateDto: UpdateTemplateDto,
  ): Promise<Bot> {
    try {
      return this.dbQuery.updateTemplate(templateId, updateTemplateDto);
    } catch (e) {
      return e;
    }
  }

  async removeTemplate(templateId: string): Promise<Bot> {
    try {
      return await this.dbQuery.removeTemplate(templateId);
    } catch (e) {
      return e;
    }
  }

  async copyBot(
    profileId: string,
    botId: string,
    copyBotDto: CopyBotDto,
    ability: PureAbility,
  ): Promise<Bot> {
    try {
      return await this.dbQuery.copy(profileId, botId, copyBotDto, ability);
    } catch (e) {
      if (e.code === 11000) {
        throw new ConflictException(
          'Переименуйте уже скопированного бота или повторите опе6рацию копирования',
        );
      } else {
        return e;
      }
    }
  }
}
