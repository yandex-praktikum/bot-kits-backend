import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { MongoServerError } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { Mailing, MailingDocument } from './schema/mailing.schema';
import { Model, Error } from 'mongoose';
import { UpdateMailingDTO } from './dto/update-mailing.dto';
import { CreateMailingDTO } from './dto/create-mailing.dto';
import { Profile } from 'src/profiles/schema/profile.schema';
import { Bot, BotDocument } from 'src/bots/schema/bots.schema';

@Injectable()
export class MailingRepository {
  constructor(
    @InjectModel(Mailing.name) private mailingModel: Model<MailingDocument>,
    @InjectModel(Bot.name) private botModel: Model<BotDocument>,
  ) {}

  async findById(id: string | number): Promise<Mailing> {
    const post = await this.mailingModel.findById(id);

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return await post.populate('platform');
  }

  async findAll(): Promise<Mailing[]> {
    return await this.mailingModel.find().exec();
  }

  async findAllActive(): Promise<Mailing[]> {
    return await this.mailingModel.find({ isActive: true }).exec();
  }

  async findAllByBotId(botId: string): Promise<Mailing[]> {
    return await this.mailingModel
      .find()
      .where({ bot: botId })
      .populate('platforms');
  }

  async remove(id: string | number): Promise<Mailing> {
    return await this.mailingModel.findByIdAndRemove(id).exec();
  }

  async update(
    updateMailingDTO: UpdateMailingDTO,
    id: string | number,
    userId: string,
  ): Promise<Mailing> {
    try {
      const post = await this.mailingModel.findById(id).populate('bot');

      if (userId !== post.bot.profile._id) {
        throw new ForbiddenException('Вы не являетесь владельцем бота');
      }
      const updatedPost = await post.updateOne(updateMailingDTO, { new: true });

      if (!updatedPost)
        throw new NotFoundException(`Post with ID ${id} not found`);

      return await updatedPost.populate('platform');
    } catch (err) {
      if (err instanceof Error.CastError)
        throw new BadRequestException('Invalid resource id');
      throw err;
    }
  }

  async create(
    user: Profile,
    createMailingDTO: CreateMailingDTO,
  ): Promise<Mailing> {
    try {
      const bot = await this.botModel
        .findById(createMailingDTO.bot)
        .populate('profile');
      const botCreatorId = bot.profile._id.toString();
      const userId = user._id.toString();
      const grantedSharedAccess = bot.profile.grantedSharedAccess;

      if (!bot.permission.mailing) {
        throw new ForbiddenException('У бота нет прав на рассылку');
      }

      if (userId !== botCreatorId && !grantedSharedAccess.length) {
        throw new ForbiddenException('У вас нет прав на рассылку');
      }

      if (userId !== botCreatorId) {
        grantedSharedAccess.forEach((access) => {
          if (!access.mailing || access.profile._id.toString() !== userId) {
            throw new ForbiddenException('У вас нет прав на рассылку');
          }
        });
      }

      const post = (() => {
        if (createMailingDTO.schedule.date) {
          const timezone = createMailingDTO.schedule.date.timezone
            ? createMailingDTO.schedule.date.timezone
            : '+0300';
          const dateIsoString = `${createMailingDTO.schedule.date.date}T${createMailingDTO.schedule.date.time}${timezone}`;
          return new this.mailingModel({
            ...createMailingDTO,
            schedule: {
              ...createMailingDTO.schedule,
              date: new Date(dateIsoString),
            },
          });
        } else {
          return new this.mailingModel(createMailingDTO);
        }
      })();

      await post.save();
      return post.populate('platforms');
    } catch (err) {
      if (err instanceof MongoServerError && err.code === 11000) {
        throw new ConflictException('Такой пост уже существует');
      }
      if (err instanceof ForbiddenException) {
        throw new ForbiddenException(err.message);
      }
      //500й код
      throw new Error(err);
    }
  }
}
