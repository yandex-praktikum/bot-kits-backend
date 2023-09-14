import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Error, Model } from 'mongoose';
import { BotTemplate, BotTemplateDocument } from './schema/bot-template.schema';
import UpdateBotTemplateDto from './dto/update.bot-template.dto';
import CreateBotTemplateDto from './dto/create.bot-template.dto';

@Injectable()
export class BotTemplatesService {
  constructor(
    @InjectModel(BotTemplate.name)
    private readonly botTemplateModel: Model<BotTemplate>,
  ) {}

  async create(createBotTemplateDto: CreateBotTemplateDto) {
    const botTemplate = await this.botTemplateModel.create(
      createBotTemplateDto,
    );
    const savedBotTemplate = await botTemplate.save();
    return { ...savedBotTemplate.toJSON(), _id: savedBotTemplate.id };
  }

  async update(id: string, updateBotTemplateDto: UpdateBotTemplateDto) {
    try {
      const result = await this.botTemplateModel
        .findByIdAndUpdate(id, updateBotTemplateDto, { new: true })
        .exec();
      if (!result) throw new NotFoundException();
      return { ...result.toJSON(), _id: result.id };
    } catch (e) {
      if (e instanceof Error.CastError)
        throw new BadRequestException('Invalid resource id');
      throw e;
    }
  }

  async findAll() {
    return (await this.botTemplateModel.find().exec()).flatMap((it) => ({
      ...it.toJSON(),
      _id: it.id,
    }));
  }

  async findById(id: string) {
    try {
      const result: BotTemplateDocument = await this.botTemplateModel
        .findById(id)
        .exec();
      if (!result) throw new NotFoundException();
      return { ...result.toJSON(), _id: result.id };
    } catch (e) {
      if (e instanceof Error.CastError)
        throw new BadRequestException('Invalid resource id');
      throw e;
    }
  }
}
