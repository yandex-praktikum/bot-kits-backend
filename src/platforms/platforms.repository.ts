import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Platform, PlatformDocument } from './schema/platforms.schema';
import { CreatePlatformDto } from './dto/create-platform.dto';
import { UpdatePlatformDto } from './dto/update-platform.dto';

@Injectable()
export class PlatformRepository {
  constructor(
    @InjectModel(Platform.name) private platformModel: Model<PlatformDocument>,
  ) {}

  async create(createPlatformDto: CreatePlatformDto): Promise<Platform> {
    try {
      return await new this.platformModel(createPlatformDto).save();
    } catch ({ code }) {
      if (code === 11000) {
        throw new ConflictException('Такая платформа уже существует');
      }
    }
  }

  async findAll(): Promise<Platform[]> {
    try {
      const platforms = await this.platformModel.find();
      if (platforms.length === 0)
        throw new NotFoundException('Нет не одной платформы');
      return platforms;
    } catch (error) {
      throw new NotFoundException(error.message || 'Что-то пошло не так');
    }
  }

  async findOne(id: string): Promise<Platform> {
    try {
      const tariff = await this.platformModel.findById(id).exec();
      if (!tariff) throw new NotFoundException('Платформы с таким id нет');
      return tariff;
    } catch (error) {
      throw new NotFoundException(error.message || 'Что-то пошло не так');
    }
  }

  async update(
    id: string,
    updatePlatformDto: UpdatePlatformDto,
  ): Promise<Platform> {
    try {
      await this.findOne(id);
      return await this.platformModel.findByIdAndUpdate(id, updatePlatformDto, {
        new: true,
      });
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Платформа с таким именем уже существует');
      }
      throw new NotFoundException(error.message || 'Что-то пошло не так');
    }
  }

  async remove(id: string): Promise<Platform> {
    try {
      const platform = await this.platformModel.findByIdAndDelete(id).exec();
      if (!platform) {
        throw new NotFoundException('Такая платформа не найден');
      }
      return platform;
    } catch (error) {
      throw new NotFoundException(error.message || 'Что-то пошло не так');
    }
  }
}
