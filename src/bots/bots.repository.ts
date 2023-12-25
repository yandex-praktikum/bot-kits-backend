import { InjectModel } from '@nestjs/mongoose';
import { Bot, BotDocument } from './schema/bots.schema';
import { Model } from 'mongoose';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBotDto } from './dto/create-bot.dto';
import { UpdateBotDto } from './dto/update-bot.dto';
import { ShareBotDto } from './dto/share-bot.dto';
import { BotAccessesService } from '../botAccesses/botAccesses.service';
import { defaultPermission, fullPermission } from '../botAccesses/types/types';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { CopyBotDto } from './dto/copy-bot.dto';
import { v4 as uuidv4 } from 'uuid';
import { Action } from 'src/ability/ability.factory';
import { PureAbility } from '@casl/ability';

@Injectable()
export class BotsRepository {
  constructor(
    @InjectModel(Bot.name) private botModel: Model<BotDocument>,
    private readonly botAccessesService: BotAccessesService,
  ) {}

  async create(
    profile,
    createBotDto: CreateBotDto,
    ability: PureAbility,
    id?: string,
  ): Promise<Bot> {
    createBotDto.type = 'custom';

    let bot;
    // Если пользователь создает бота из шаблона по ID
    if (id) {
      // Найти существующий шаблон бота по ID
      bot = await this.botModel.findById(id).select('-_id -updatedAt');

      if (!ability.can(Action.CreateOnlyFromTemplate, bot)) {
        throw new ForbiddenException('Создание возможно только из шаблона');
      }

      Object.assign(bot, createBotDto);
      const botData = bot.toObject();

      const rndId = uuidv4().slice(0, 8);

      bot = new this.botModel({
        ...botData,
        profile,
        title: bot.title + `_copy_${rndId}`,
      });
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

  //bots.repository.ts
  async update(
    botId: string,
    updateBotDto: UpdateBotDto,
    ability: PureAbility,
  ): Promise<Bot> {
    const existingBot = await this.botModel.findById(botId).exec();

    if (!existingBot) {
      throw new NotFoundException(`Бот с ID ${botId} не найден`);
    }

    if (!ability.can(Action.Update, existingBot)) {
      throw new ForbiddenException('Вы не администратор этого бота');
    }

    try {
      await this.botModel.findByIdAndUpdate(botId, updateBotDto).exec();
    } catch (e) {
      return e;
    }

    return this.findOne(botId);
  }

  async remove(userId: string, botId: string): Promise<Bot> {
    const hasFullAccess = await this.botAccessesService.hasFullAccess(
      userId,
      botId,
    );
    if (!hasFullAccess) {
      throw new ForbiddenException('Недостаточно прав для удаления бота');
    }
    const existingTemplate = await this.botModel.findById(botId).exec();
    if (!existingTemplate) {
      throw new NotFoundException(`Бот с ID ${botId} не найден`);
    }
    return await this.botModel.findByIdAndRemove(botId).exec();
  }

  async copy(
    profileId: string,
    botId: string,
    copyBotDto: CopyBotDto,
    ability: PureAbility,
  ): Promise<Bot> {
    const rndId = uuidv4().slice(0, 8);
    const bot = await this.botModel.findById(botId).select('-_id -updatedAt');

    if (!ability.can(Action.Copy, bot)) {
      throw new ForbiddenException('Копировать можно только своих ботов');
    }

    Object.assign(bot, copyBotDto);
    const botData = bot.toObject();

    return await this.create(
      profileId,
      {
        ...botData,
        title: botData.title + `_copy_${rndId}`,
        messengers: copyBotDto.messengers,
      },
      ability,
    );
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
    const existingTemplate = await this.botModel.findById(templateId).exec();
    if (!existingTemplate) {
      throw new NotFoundException(`Шаблон с ID ${templateId} не найден`);
    }
    await this.botModel.findByIdAndUpdate(templateId, updateTemplateDto).exec();
    return this.findOne(templateId);
  }

  async removeTemplate(templateId: string): Promise<Bot> {
    const existingTemplate = await this.botModel.findById(templateId).exec();
    if (!existingTemplate) {
      throw new NotFoundException(`Шаблон с ID ${templateId} не найден`);
    }
    return await this.botModel.findByIdAndRemove(templateId).exec();
  }
}
