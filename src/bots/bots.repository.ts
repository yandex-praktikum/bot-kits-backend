import { InjectModel } from '@nestjs/mongoose';
import { Bot, BotDocument } from './schema/bots.schema';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
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
import { FilesBucketService } from 'src/gridFS/gridFS.service';
import * as fs from 'node:fs';
import * as path from 'node:path';

@Injectable()
export class BotsRepository {
  constructor(
    @InjectModel(Bot.name) private botModel: Model<BotDocument>,
    private readonly botAccessesService: BotAccessesService,
    private readonly gridFS: FilesBucketService,
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

  async filesUpload(files: Array<Express.Multer.File>) {
    const bucket = this.gridFS.getBucket();
    console.log(files.length);
    if (files.length === 0) {
      throw new BadRequestException('no files provided');
    }
    const filesIds: string[] = await Promise.all(
      files.map(async (file) => {
        try {
          const filepath = path.join(
            process.cwd(),
            '..',
            `attachments/${file.originalname}`,
          );
          await fs.promises.writeFile(filepath, file.buffer);
          const uploadPromise = new Promise<ObjectId>((resolve, reject) => {
            const uploadStream = bucket.openUploadStream(file.originalname, {
              metadata: { mime: file.mimetype },
            });

            const readStream = fs.createReadStream(filepath);
            readStream.pipe(uploadStream);

            uploadStream.on('finish', () => {
              console.log(`${uploadStream.id} id of file`);
              resolve(uploadStream.id);
            });
            uploadStream.on('error', (e) => {
              reject(e);
            });
          });

          const fileId = await uploadPromise;
          return fileId.toString();
        } catch (error) {
          return error;
        }
      }),
    );
    return filesIds;
  }

  async filesDownload(id: string): Promise<StreamableFile> {
    const bucket = this.gridFS.getBucket();
    const fileMeta = bucket.find({ _id: new ObjectId(id) });
    let meta;
    for await (const doc of fileMeta) {
      meta = doc;
    }
    console.log(meta);
    if (meta === undefined) {
      throw new NotFoundException('cant find picture with this id', {
        cause: new Error(),
        description: 'Wrong ObjectId',
      });
    }
    const downloadStream = bucket.openDownloadStream(new ObjectId(id));
    const filePath = path.join(
      process.cwd(),
      '..',
      `downloaded/${meta.filename}`,
    );
    const writeStream = fs.createWriteStream(filePath);

    // Создаем Promise для отслеживания завершения операции скачивания
    const downloadPromise = new Promise<void>((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    // Подписываемся на событие завершения скачивания
    downloadStream.pipe(writeStream);

    // Дожидаемся завершения скачивания
    await downloadPromise;

    // После завершения скачивания, создаем поток для чтения файла
    const fileReadStream = fs.createReadStream(filePath);
    return new StreamableFile(fileReadStream);
  }

  async filesDelete(id: string) {
    const bucket = this.gridFS.getBucket();
    try {
      await bucket.delete(new ObjectId(id));
      return { message: 'successfully deleted' };
    } catch (e) {
      return e;
    }
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
    botId: string,
    updateBotDto: UpdateBotDto,
  ): Promise<Bot> {
    const permission = await this.botAccessesService.getPermission(
      userId,
      botId,
    );

    // Если есть доступ только для просмотра вкладки Воронки, то нельзя редактировать
    if (permission.voronki === LEVEL_ACCESS.VIEWER) {
      throw new ForbiddenException('Недостаточно прав для редактирования бота');
    }

    const existingTemplate = await this.botModel.findById(botId).exec();
    if (!existingTemplate) {
      throw new NotFoundException(`Бот с ID ${botId} не найден`);
    }

    await this.botModel.findByIdAndUpdate(botId, updateBotDto).exec();
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
  ): Promise<Bot> {
    const permission = await this.botAccessesService.getPermission(
      profileId,
      botId,
    );

    // Если есть доступ только для просмотра вкладки Воронки, то нельзя редактировать
    if (permission.dashboard === LEVEL_ACCESS.VIEWER) {
      throw new ForbiddenException('Недостаточно прав для копирования бота');
    }

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
