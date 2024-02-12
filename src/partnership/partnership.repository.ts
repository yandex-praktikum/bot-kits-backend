import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Partnership,
  type PartnershipDocument,
} from './schema/partnership.schema';

@Injectable()
export class PartnershipRepository {
  constructor(
    @InjectModel(Partnership.name)
    private partnershipModel: Model<PartnershipDocument>,
  ) {}

  // Найти партнерство по ID
  async findById(partnershipId: string): Promise<Partnership | null> {
    return await this.partnershipModel.findById(partnershipId).exec();
  }

  // Сохранить или обновить партнерство
  async save(partnership: Partnership): Promise<Partnership> {
    return await partnership.save();
  }

  // Создать новое партнерство
  async create(partnershipData: Partnership): Promise<Partnership> {
    const newPartnership = new this.partnershipModel(partnershipData);
    return await newPartnership.save();
  }

  // Обновить партнерство по ID
  async update(
    partnershipId: string,
    partnershipData: Partial<Partnership>,
  ): Promise<Partnership | null> {
    return await this.partnershipModel
      .findByIdAndUpdate(partnershipId, partnershipData, { new: true })
      .exec();
  }

  // Удалить партнерство по ID
  async remove(partnershipId: string): Promise<Partnership | null> {
    return await this.partnershipModel.findByIdAndRemove(partnershipId).exec();
  }
}
