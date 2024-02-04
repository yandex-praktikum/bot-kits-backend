import { InjectModel } from '@nestjs/mongoose';
import { Bot, BotDocument } from './schema/bots.schema';
import { Model } from 'mongoose';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBotDto } from './dto/create-bot.dto';
import { UpdateBotDto } from './dto/update-bot.dto';
import { ShareBotDto } from './dto/share-bot.dto';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { CopyBotDto } from './dto/copy-bot.dto';
import { v4 as uuidv4 } from 'uuid';
import { Action } from 'src/ability/ability.factory';
import { PureAbility } from '@casl/ability';
import { Profile } from 'src/profiles/schema/profile.schema';

@Injectable()
export class BotsRepository {
  constructor(
    @InjectModel(Bot.name) private botModel: Model<BotDocument>,
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
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
    return await bot.save();
  }

  async findOne(id: string): Promise<Bot> {
    return await this.botModel.findById(id).exec();
  }

  async findOneBotWithAccess(id: string, userId: Profile): Promise<Bot> {
    // Получение бота по его ID
    const bot = await this.botModel.findById(id).exec();

    if (!bot) {
      throw new Error('Bot not found');
    }

    // Получение профиля пользователя, который запрашивает данные
    const userProfile = await this.profileModel.findById(userId);

    if (!userProfile) {
      throw new Error('User profile not found');
    }

    // Проверка, принадлежит ли бот запрашивающему пользователю
    if (bot.profile.equals(userProfile._id)) {
      bot.permission = {
        dashboard: true, // предполагаем, что владелец имеет полный доступ
        botBuilder: true,
        mailing: true,
        static: true,
      };
    } else {
      // Извлечение прав доступа для бота, предоставленных другими пользователями
      const access = userProfile.receivedSharedAccess.find((a) =>
        a.profile.equals(bot.profile._id),
      );

      if (access) {
        bot.permission = {
          dashboard: access.dashboard,
          botBuilder: access.botBuilder,
          mailing: access.mailing,
          static: access.static,
        };
      } else {
        throw new Error('Доступ этому боту не предоставлен');
      }
    }

    return bot;
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
    botId: string,
    updateBotDto: UpdateBotDto,
    ability: PureAbility,
  ): Promise<Bot> {
    const existingBot = await this.botModel.findById(botId).exec();

    if (!existingBot) {
      throw new NotFoundException(`Бот с ID ${botId} не найден`);
    }

    existingBot.permission = updateBotDto.permission;

    if (!ability.can(Action.Update, existingBot)) {
      throw new ForbiddenException('Вы не администратор этого бота');
    }
    //--Не обновляем права у бота даже у собственного--//
    try {
      const { permission, ...updateData } = updateBotDto;
      await this.botModel.findByIdAndUpdate(botId, updateData).exec();
    } catch (e) {
      return e;
    }
    //--Отдаем бота обновленного бота без объекта с правами--//
    return await this.botModel.findById(botId).select('-permission').exec();
  }

  async remove(
    userId: string,
    botId: string,
    ability: PureAbility,
  ): Promise<Bot> {
    const existingTemplate = await this.botModel.findById(botId).exec();

    if (!existingTemplate) {
      throw new NotFoundException(`Бот с ID ${botId} не найден`);
    }

    if (!ability.can(Action.Delete, existingTemplate)) {
      throw new ForbiddenException('Удалять можно только своих ботов');
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

    try {
      const bot = await this.botModel.findById(botId).select('-_id -updatedAt');

      if (!bot) {
        throw new NotFoundException(`Бот с ID ${botId} не найден`);
      }

      if (!ability.can(Action.Copy, bot)) {
        throw new ForbiddenException('Копировать можно только своих ботов');
      }

      Object.assign(bot, copyBotDto);
      const botData = bot.toObject();
      try {
        return await this.create(
          profileId,
          {
            ...botData,
            title: botData.title + `_copy_${rndId}`,
            messengers: copyBotDto.messengers,
          },
          ability,
        );
      } catch (e) {
        throw new BadRequestException(`dsfsdfsdf`);
      }
    } catch (e) {
      throw new BadRequestException(`Бот с ID ${botId} не найден`);
    }
  }

  async findAllByUserNew(userId: string): Promise<Bot[]> {
    // Получение профиля пользователя с одним запросом
    const userProfile = await this.profileModel.findById(userId);

    // Извлечение всех ID профилей, которые предоставили доступ
    const accessProfiles = userProfile.receivedSharedAccess.map(
      (access) => access.profile,
    );

    // Агрегация запросов: получение всех ботов одним запросом
    const sharedBots = await this.botModel.find({
      profile: { $in: accessProfiles },
    });

    // Настройка прав доступа для sharedBots
    sharedBots.forEach((bot) => {
      const access = userProfile.receivedSharedAccess.find((a) =>
        a.profile.equals(bot.profile._id),
      );
      bot.permission = {
        dashboard: access?.dashboard,
        botBuilder: access?.botBuilder,
        mailing: access?.mailing,
        static: access?.static,
      };
    });

    // Получение собственных ботов пользователя
    const ownBots = await this.botModel.find({ profile: userId });

    // Объединение списков ботов
    return ownBots.concat(sharedBots);
  }

  async share(
    profile: string,
    id: string,
    shareBotDto: ShareBotDto,
  ): Promise<string> {
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
