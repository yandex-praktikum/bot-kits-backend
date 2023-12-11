import { InjectModel } from '@nestjs/mongoose';
import { Bot, BotDocument } from './schema/bots.schema';
import { Model } from 'mongoose';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBotDto } from './dto/create-bot.dto';
import { UpdateBotDto } from './dto/update-bot.dto';
import { ShareBotDto } from './dto/share-bot.dto';
import { BotAccessesService } from '../botAccesses/botAccesses.service';
import {
  defaultPermission,
  fullPermission,
  LEVEL_ACCESS,
} from '../botAccesses/types/types';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { CopyBotDto } from './dto/copy-bot.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BotsRepository {
  constructor(
    @InjectModel(Bot.name) private botModel: Model<BotDocument>,
    private readonly botAccessesService: BotAccessesService,
  ) {}

  async create(profile, createBotDto: CreateBotDto, id?: string): Promise<Bot> {
    createBotDto.type = 'custom';

    let bot;
    if (id) {
      // Найти существующий шаблон бота по ID
      bot = await this.botModel.findById(id).select('-_id -updatedAt').lean();
      if (bot.type !== 'template') {
        throw new Error('Создание возможно только из шаблона');
      }
      // Обновляем данные шаблона бота данными из createBotDto у сразу удаляем ненужные поля
      const { isToPublish, ...botFromTemplate } = await Object.assign(
        bot,
        createBotDto,
      );

      bot = new this.botModel({ ...botFromTemplate, profile });
    } else {
      // Создаем новый экземпляр бота, если ID не предоставлен
      bot = new this.botModel({ ...createBotDto, profile });
    }

    // При создании бота, создаем доступ сразу с полным уровнем
    await this.botAccessesService.create(profile, {
      botId: bot.id,
      permission: fullPermission,
    });
    return await bot.save();
  }

  async findOne(id: string): Promise<Bot> {
    return await this.botModel.findById(id).exec();
  }

  async findAllByUser(userId: string): Promise<Bot[] | null> {
    return this.botModel.find({ profile: userId });
  }

  async findAll(): Promise<Bot[]> {
    return await this.botModel.find().exec();
  }

  async findAllTemplates(): Promise<Bot[]> {
    return await this.botModel.find({ type: 'template' }).exec();
  }

  async update(
    userId: string,
    id: string,
    updateBotDto: UpdateBotDto,
  ): Promise<Bot> {
    const permission = await this.botAccessesService.getPermission(userId, id);

    // Если есть доступ только для просмотра вкладки Воронки, то нельзя редактировать
    if (permission.voronki === LEVEL_ACCESS.VIEWER) {
      throw new ForbiddenException('Недостаточно прав для редактирования бота');
    }

    await this.botModel.findByIdAndUpdate(id, updateBotDto).exec();
    return this.findOne(id);
  }

  async remove(userId: string, id: string): Promise<Bot> {
    const hasFullAccess = await this.botAccessesService.hasFullAccess(
      userId,
      id,
    );
    if (!hasFullAccess) {
      throw new ForbiddenException('Недостаточно прав для удаления бота');
    }
    return await this.botModel.findByIdAndRemove(id).exec();
  }

  async copy(
    profileId: string,
    botId: string,
    copyBotDto: CopyBotDto,
  ): Promise<Bot> {
    const rndId = uuidv4().slice(0, 8);
    const bot = await this.botModel
      .findById(botId)
      .select('-_id -updatedAt')
      .lean();
    return await this.create(profileId, {
      ...bot,
      title: bot.title + `_copy_${rndId}`,
      messengers: copyBotDto.messengers,
    });
  }

  async share(
    profile: string,
    id: string,
    shareBotDto: ShareBotDto,
  ): Promise<string> {
    // создаем первичный уровень доступа
    await this.botAccessesService.shareAccess(profile, id, {
      email: shareBotDto.email,
      permission: defaultPermission,
    });

    return 'Запрос на предоставление доступа отправлен';
  }

  async createTemplate(createTemplateDto: CreateTemplateDto): Promise<Bot> {
    createTemplateDto.type = 'template';
    const bot = await new this.botModel(createTemplateDto).save();

    return bot;
  }

  async updateTemplate(
    templateId: string,
    updateTemplateDto: UpdateTemplateDto,
  ): Promise<Bot> {
    await this.botModel.findByIdAndUpdate(templateId, updateTemplateDto).exec();
    return this.findOne(templateId);
  }

  async removeTemplate(templateId: string): Promise<Bot> {
    return await this.botModel.findByIdAndRemove(templateId).exec();
  }
}
