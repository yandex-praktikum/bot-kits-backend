import { Bot } from './schema/bots.schema';
import { ConflictException, Injectable, StreamableFile } from '@nestjs/common';
import { CreateBotDto } from './dto/create-bot.dto';
import { UpdateBotDto } from './dto/update-bot.dto';
import { ShareBotDto } from './dto/share-bot.dto';
import { BotsRepository } from './bots.repository';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { CopyBotDto } from './dto/copy-bot.dto';
import { FilesBucketService } from 'src/gridFS/gridFS.service';
@Injectable()
export class BotsService {
  constructor(
    private dbQuery: BotsRepository,
    private gridFS: FilesBucketService,
  ) {}

  async uploadFiles(files: Array<Express.Multer.File>) {
    try {
      return await this.dbQuery.filesUpload(files);
    } catch (e) {
      return e;
    }
  }

  async downloadFile(id: string): Promise<StreamableFile> {
    try {
      return await this.dbQuery.filesDownload(id);
    } catch (e) {
      return e;
    }
  }

  async deleteFile(id: string) {
    try {
      return await this.dbQuery.filesDelete(id);
    } catch (e) {
      return e;
    }
  }

  async create(profile, createBotDto: CreateBotDto, id?: string): Promise<Bot> {
    try {
      return await this.dbQuery.create(profile, createBotDto, id);
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

  async findAllByUser(userId: string): Promise<Bot[] | null> {
    try {
      return this.dbQuery.findAllByUser(userId);
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
    userId: string,
    botId: string,
    updateBotDto: UpdateBotDto,
  ): Promise<Bot> {
    try {
      return this.dbQuery.update(userId, botId, updateBotDto);
    } catch (e) {
      if (e.code === 11000) {
        throw new ConflictException('Бот с таким имененм уже существует');
      } else {
        return e;
      }
    }
  }

  async remove(userId: string, id: string): Promise<Bot> {
    try {
      return await this.dbQuery.remove(userId, id);
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
  ): Promise<Bot> {
    try {
      return await this.dbQuery.copy(profileId, botId, copyBotDto);
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
