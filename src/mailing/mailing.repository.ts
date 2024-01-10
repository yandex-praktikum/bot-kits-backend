import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { MongoServerError } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { Mailing, MailingDocument } from './schema/mailing.schema';
import { Model, Error } from 'mongoose';
import { UpdateMailingDTO } from './dto/update-mailing.dto';
import { CreateMailingDTO } from './dto/create-mailing.dto';

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

  async remove(id: string | number): Promise<Mailing> {
    return await this.mailingModel.findByIdAndRemove(id).exec();
  }

  async update(
    updateMailingDTO: UpdateMailingDTO,
    id: string | number,
  ): Promise<Mailing> {
    try {
      const post = await this.mailingModel.findByIdAndUpdate(
        id,
        updateMailingDTO,
        { new: true },
      );

      if (!post) throw new NotFoundException(`Post with ID ${id} not found`);

      return await post.populate('platform');
    } catch (err) {
      if (err instanceof Error.CastError)
        throw new BadRequestException('Invalid resource id');
      throw err;
    }
  }

  async create(createMailingDTO: CreateMailingDTO): Promise<Mailing> {
    try {
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
