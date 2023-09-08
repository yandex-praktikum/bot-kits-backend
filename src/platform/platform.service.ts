import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Platform, PlatformDocument } from './schema/platform.schema';
import { CreatePlatformDto } from './dto/create-platform.dto';
import { UpdatePlatformDto } from './dto/update-platform.dto';

@Injectable()
export class PlatformService {
  constructor(
    @InjectModel(Platform.name) private platformModel: Model<PlatformDocument>,
  ) {}

  async create(createPlatformDto: CreatePlatformDto): Promise<Platform> {
    return await new this.platformModel(createPlatformDto).save();
  }

  async findAll(): Promise<Platform[]> {
    return await this.platformModel.find().exec();
  }

  async findOne(id: string): Promise<Platform> {
    return await this.platformModel.findById(id).exec();
  }

  async update(
    id: string,
    updatePlatformDto: UpdatePlatformDto,
  ): Promise<Platform> {
    return await this.platformModel.findByIdAndUpdate(id, updatePlatformDto, {
      new: true,
    });
  }

  async remove(id: string): Promise<Platform> {
    return await this.platformModel.findByIdAndDelete(id).exec();
  }
}
