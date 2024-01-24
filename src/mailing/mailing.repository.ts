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

@Injectable()
export class MailingRepository {
  constructor(
    @InjectModel(Mailing.name) private mailingModel: Model<MailingDocument>,
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
    return await this.mailingModel.find().where({ 'bot._id': botId });
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
      if (!createMailingDTO.bot.permission.mailing) {
        throw new ForbiddenException('У бота нет прав на рассылку');
      }
      if (user._id !== createMailingDTO.bot.profile._id) {
        throw new ForbiddenException('Вы не являетесь владельцем бота');
      }

      const post = await this.mailingModel.create(createMailingDTO);
      return await post.save();
    } catch (err) {
      if (err instanceof MongoServerError && err.code === 11000) {
        throw new ConflictException('Такой пост уже существует');
      }
      //500й код
      throw new Error('Что-то пошло не так');
    }
  }
}
