import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Types } from 'mongoose';
import {
  Partnership,
  type PartnershipDocument,
} from './schema/partnership.schema';
import { IPartnership } from './schema/types';

@Injectable()
export class PartnershipRepository {
  constructor(
    @InjectModel(Partnership.name)
    private partnershipModel: Model<PartnershipDocument>,
  ) {}

  async findByPartnerRef(partner_ref: string): Promise<Partnership | null> {
    return await this.partnershipModel
      .findOne({ partner_ref: partner_ref })
      .exec();
  }

  // Найти партнерство по ID
  async findById(partnershipId: string): Promise<Partnership | null> {
    return await this.partnershipModel.findById(partnershipId).exec();
  }

  // Сохранить или обновить партнерство
  async save(
    partnership: Partnership,
    session?: ClientSession,
  ): Promise<Partnership> {
    if (!session) {
      return await partnership.save();
    }
    return await partnership.save({ session: session });
  }

  // Создать новое партнерство
  async create(
    partnershipData: IPartnership,
    session?: ClientSession,
  ): Promise<IPartnership> {
    const newPartnership = new this.partnershipModel(partnershipData);
    // Проверяем, передана ли сессия, и если да, то используем её для сохранения документа
    if (!session) {
      return await newPartnership.save();
    }
    return await newPartnership.save({ session });
  }

  async addPaymentToRegistrationRef(
    partner_ref: string,
    paymentData: {
      profileId: Types.ObjectId;
      paymentDate: Date;
      amount: number;
    },
  ): Promise<Partnership | null> {
    const partnership = await this.partnershipModel.findOne({
      partner_ref: partner_ref,
    });
    if (!partnership) {
      console.log(`Partnership with partner_ref ${partner_ref} not found.`);
      return null;
    }

    // Найти запись registration_ref по profileId
    const registrationIndex = partnership.registration_ref.findIndex((reg) =>
      reg.profileId.equals(paymentData.profileId),
    );
    if (registrationIndex === -1) {
      console.log(
        `Profile ${paymentData.profileId} not found in registration_ref.`,
      );
      return partnership;
    }

    // Добавить информацию об оплате
    partnership.registration_ref[registrationIndex].payments.push({
      paymentDate: paymentData.paymentDate,
      amount: paymentData.amount,
    });

    // Сохранить обновленное партнерство
    await partnership.save();
    return partnership;
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
