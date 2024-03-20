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
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { CopyBotDto } from './dto/copy-bot.dto';
import { v4 as uuidv4 } from 'uuid';
import { FilesBucketService } from 'src/gridFS/gridFS.service';
import { Action } from 'src/ability/ability.factory';
import { PureAbility } from '@casl/ability';
import { Profile } from 'src/profiles/schema/profile.schema';
import {
  MessageDataTypes,
  TFileData,
  TMessageBlock,
} from './schema/types/botBuilderTypes';

@Injectable()
export class BotsRepository {
  constructor(
    @InjectModel(Bot.name) private botModel: Model<BotDocument>,
    private readonly gridFS: FilesBucketService,
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
  ) {}

  //-- Функция для создания бота с возможностью клонирования из шаблона --//
  async create(
    profile,
    createBotDto: CreateBotDto,
    ability: PureAbility, //-- Права доступа пользователя --//
    id?: string,
  ): Promise<Bot> {
    createBotDto.type = 'custom'; //-- Устанавливаем тип бота как пользовательский --//

    let bot;
    if (id) {
      //-- Поиск и выбор шаблона бота по ID без поля _id и updatedAt --//
      bot = await this.botModel.findById(id).select('-_id -updatedAt');

      if (!ability.can(Action.CreateOnlyFromTemplate, bot)) {
        //-- Выбрасываем исключение, если пользователь создает бота из другого бота --//
        throw new ForbiddenException('Создание возможно только из шаблона');
      }

      Object.assign(bot, createBotDto); //-- Обновляем шаблон данными нового бота --//
      const botData = bot.toObject(); //-- Конвертируем документ Mongoose в объект JavaScript --//

      const rndId = uuidv4().slice(0, 8); //-- Генерация уникального идентификатора для названия бота --//

      bot = new this.botModel({
        ...botData,
        profile,
        title: bot.title + `_copy_${rndId}`, //-- Добавление идентификатора к названию бота --//
      });
    } else {
      //-- Создание нового экземпляра бота с данными из DTO, если шаблон не используется --//
      bot = new this.botModel({ ...createBotDto, profile });
    }
    return await bot.save();
  }

  async findOne(id: string): Promise<Bot> {
    return await this.botModel.findById(id).exec();
  }

  //-- Функция для поиска бота с проверкой доступа пользователя --//
  async findOneBotWithAccess(id: string, userId: Profile): Promise<Bot> {
    const bot = await this.botModel.findById(id).exec();

    //-- Выбрасывание ошибки, если бот не найден --//
    if (!bot) {
      throw new Error('Бот не найден');
    }

    //-- Получение профиля пользователя, который запрашивает данные --//
    const userProfile = await this.profileModel.findById(userId);

    //-- Выбрасывание ошибки, если профиль пользователя не найден --//
    if (!userProfile) {
      throw new Error('Профиль пользователя не найден');
    }

    //-- Проверка, принадлежит ли бот запрашивающему пользователю --//
    if (bot.profile.equals(userProfile._id)) {
      //-- Назначение полных прав доступа, если пользователь является владельцем бота --//
      bot.permission = {
        dashboard: true,
        botBuilder: true,
        mailing: true,
        statistics: true,
      };
    } else {
      //-- Поиск прав доступа, предоставленных другими пользователями, если запросивший пользователь не владелец --//
      const access = userProfile.receivedSharedAccess.find((a) =>
        a.profile.equals(bot.profile._id),
      );

      if (access) {
        //-- Назначение прав доступа согласно предоставленным разрешениям --//
        bot.permission = {
          dashboard: access.dashboard,
          botBuilder: access.botBuilder,
          mailing: access.mailing,
          statistics: access.statistics,
        };
      } else {
        //-- Выбрасывание ошибки, если права доступа не найдены --//
        throw new Error('Доступ этому боту не предоставлен');
      }
    }

    return bot; //-- Возвращение бота с установленными правами доступа --//
  }

  //-- Функция для обновления данных бота --//
  async update(
    botId: string,
    updateBotDto: UpdateBotDto,
    ability: PureAbility,
  ): Promise<Bot> {
    //-- Поиск существующего бота по идентификатору --//
    const existingBot = await this.botModel.findById(botId).exec();

    //-- Если бот не найден, выбрасываем исключение --//
    if (!existingBot) {
      throw new NotFoundException(`Бот с ID ${botId} не найден`);
    }

    existingBot.permission = updateBotDto.permission; //-- Временно обновляем права в модели, но не сохраняем в БД, чтобы проверить права в правилах --//

    //-- Проверка, имеет ли пользователь право на обновление этого бота --//
    if (!ability.can(Action.Update, existingBot)) {
      throw new ForbiddenException('Вы не администратор этого бота');
    }

    try {
      //-- Исключение прав из объекта DTO для предотвращения их обновления в БД --//
      const { permission, ...updateData } = updateBotDto;
      //-- Обновление данных бота в базе данных без изменения прав доступа --//
      await this.botModel.findByIdAndUpdate(botId, updateData).exec();
    } catch (e) {
      //-- Возврат ошибки, если обновление не удалось --//
      return e;
    }

    //-- Возвращение обновленных данных бота без информации о правах доступа --//
    return await this.botModel.findById(botId).select('-permission').exec();
  }

  //-- Функция для удаления бота --//
  async remove(
    userId: string,
    botId: string,
    ability: PureAbility,
  ): Promise<Bot> {
    //-- Поиск бота по идентификатору для проверки его существования --//
    const existingTemplate = await this.botModel.findById(botId).exec();

    //-- Если бот не найден, выбрасывается исключение --//
    if (!existingTemplate) {
      throw new NotFoundException(`Бот с ID ${botId} не найден`);
    }

    //-- Проверка прав пользователя на удаление данного бота --//
    if (!ability.can(Action.Delete, existingTemplate)) {
      throw new ForbiddenException('Удалять можно только своих ботов');
    }

    //-- Удаление бота из базы данных и возвращение информации об удаленном боте --//
    return await this.botModel.findByIdAndRemove(botId).exec();
  }

  //-- Функция для копирования бота --//
  async copy(
    profileId: string,
    botId: string,
    copyBotDto: CopyBotDto,
    ability: PureAbility,
  ): Promise<Bot> {
    //-- Генерация уникального идентификатора для названия копии --//
    const rndId = uuidv4().slice(0, 8);

    try {
      //-- Поиск бота по ID с исключением полей _id и updatedAt --//
      const bot = await this.botModel.findById(botId).select('-_id -updatedAt');

      //-- Если бот не найден, выбрасывается исключение --//
      if (!bot) {
        throw new NotFoundException(`Бот с ID ${botId} не найден`);
      }

      //-- Копировать можно только своих ботов, даже если их расшарили --//
      if (!ability.can(Action.Copy, bot)) {
        throw new ForbiddenException('Копировать можно только своих ботов');
      }

      //-- Назначение данных из DTO копии на найденный бот для создания новой копии --//
      Object.assign(bot, copyBotDto);
      const botData = bot.toObject(); //-- Конвертация документа Mongoose в обычный JS объект --//

      try {
        //-- Создание новой копии бота с использованием метода create и возвращение результата --//
        return await this.create(
          profileId,
          {
            ...botData,
            title: botData.title + `_copy_${rndId}`, //-- Добавление уникального идентификатора к названию --//
            messengers: copyBotDto.messengers, //-- Назначение мессенджеров из DTO --//
          },
          ability,
        );
      } catch (e) {
        //-- Обработка возможных ошибок при создании копии и выброс исключения --//
        throw new BadRequestException(`Ошибка создания копии бота`);
      }
    } catch (e) {
      //-- Общая обработка ошибок и выброс исключения, если бот не найден --//
      throw new BadRequestException(`Бот с ID ${botId} не найден`);
    }
  }

  //-- Функция для получения всех ботов, связанных с пользователем, включая собственные и предоставленные --//
  async findAllByUserNew(userId: string): Promise<Bot[]> {
    //-- Получение профиля пользователя по его идентификатору --//
    const userProfile = await this.profileModel.findById(userId);

    //-- Извлечение идентификаторов профилей, которые предоставили пользователю доступ к своим ботам --//
    const accessProfiles = userProfile.receivedSharedAccess.map(
      (access) => access.profile,
    );

    //-- Получение всех ботов, к которым пользователь имеет доступ, через идентификаторы профилей --//
    const sharedBots = await this.botModel.find({
      profile: { $in: accessProfiles },
    });

    //-- Настройка прав доступа для каждого бота, доступ к которому предоставлен пользователю --//
    sharedBots.forEach((bot) => {
      const access = userProfile.receivedSharedAccess.find((a) =>
        a.profile.equals(bot.profile._id),
      );
      //-- Установка прав доступа с учетом предоставленных разрешений --//
      bot.permission = {
        dashboard: access?.dashboard,
        botBuilder: access?.botBuilder,
        mailing: access?.mailing,
        statistics: access?.statistics,
      };
    });

    //-- Получение всех ботов, принадлежащих пользователю --//
    const ownBots = await this.botModel.find({ profile: userId });

    //-- Объединение собственных ботов пользователя и ботов, к которым он имеет доступ, в один список --//
    return ownBots.concat(sharedBots);
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

  async findAllByUser(userId: string): Promise<Bot[] | null> {
    return this.botModel.find({ profile: userId });
  }

  async findAll(): Promise<Bot[]> {
    return await this.botModel.find().exec();
  }

  async findAllTemplates(): Promise<Bot[]> {
    return await this.botModel.find({ type: 'template' }).exec();
  }

  async updateNodeBots(
    fileId: Record<string, string>,
    botId: string,
    nodeId: string,
  ) {
    //-- TODO: доработать ролевую модель --//
    const bot = await this.botModel.findById(botId);

    if (!bot) {
      throw new NotFoundException(`Бот с ID ${botId} не найден`);
    }

    for (const node of bot.features.nodes) {
      if (node.id === nodeId && 'data' in node.data) {
        (node.data as TMessageBlock).data.push({
          type: MessageDataTypes.file,
          fileId: fileId.fileId,
          fileType: fileId.mime,
        });
        await bot.save();
        return (node.data as TMessageBlock).data;
      }
    }
  }

  async deleteFileNodeBot(fileId: string, botId: string, nodeId: string) {
    try {
      // Поиск бота по ID
      const bot = await this.botModel.findById(botId);

      // Если бот не найден, бросаем исключение
      if (!bot) {
        throw new NotFoundException(`Бот с ID ${botId} не найден`);
      }

      // Перебор всех узлов в поисках нужного узла по ID
      for (const node of bot.features.nodes) {
        // Проверка, соответствует ли ID узла и наличие поля data
        if (node.id === nodeId && 'data' in node.data) {
          // Находим индекс элемента в массиве data, fileId которого совпадает с искомым
          const index = (node.data as TMessageBlock).data.findIndex(
            (item: TFileData) => {
              return item.fileId === fileId;
            },
          );

          // Если элемент найден, удаляем его из массива
          if (index !== -1) {
            (node.data as TMessageBlock).data.splice(index, 1);
            await bot.save();
            return (node.data as TMessageBlock).data; // Возвращаем обновленный массив data
          }
        }
      }

      // Если узел с заданным nodeId не найден или в его data нет файла с fileId,
      // можно бросить исключение или просто вернуть текущее состояние данных
      throw new NotFoundException(
        `Файл с ID ${fileId} в узле с ID ${nodeId} не найден`,
      );
    } catch (e) {
      return e;
    }
  }
}
