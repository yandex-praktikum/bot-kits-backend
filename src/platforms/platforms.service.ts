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
import { PlatformRepository } from './platforms.repository';

@Injectable()
export class PlatformService {
  constructor(private readonly dbQuery: PlatformRepository) {}

  async create(createPlatformDto: CreatePlatformDto): Promise<Platform> {
    return await this.dbQuery.create(createPlatformDto);
  }

  async findAll(): Promise<Platform[]> {
    return await this.dbQuery.findAll();
  }

  async findOne(id: string): Promise<Platform> {
    return await this.dbQuery.findOne(id);
  }

  async update(
    id: string,
    updatePlatformDto: UpdatePlatformDto,
  ): Promise<Platform> {
    return await this.dbQuery.update(id, updatePlatformDto);
  }

  async remove(id: string): Promise<Platform> {
    return await this.dbQuery.remove(id);
  }
}
