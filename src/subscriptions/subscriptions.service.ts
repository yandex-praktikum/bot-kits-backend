import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Subscription,
  SubscriptionDocument,
} from './schema/subscription.schema';
import { Model } from 'mongoose';
import { Profile } from '../profiles/schema/profile.schema';
import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { Subscription } from './schema/subscription.schema';
import { SubscriptionsRepository } from './subscriptions.repository';
import { Profile } from 'src/profiles/schema/profile.schema';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly dbQuery: SubscriptionsRepository) {}

  async findOne(id: number): Promise<Subscription> {
    return await this.dbQuery.findOne(id);
  }

  async findAll(): Promise<Subscription[]> {
    return await this.dbQuery.findAll();
  }

  async findSubscriptionByProfile(profile: Profile) {
    return await this.dbQuery.findSubscriptionByProfile(profile);
  }

  async subscriptionAndPayments(profile: Profile) {
    return await this.dbQuery.subscriptionAndPayments(profile);
  }

  async activateSubscription(profile: Profile, status: boolean) {
    return await this.dbQuery.activateSubscription(profile, status);
  }

  async create(
    tariffId: string,
    userId: string,
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Subscription> {

    const subscription = await this.subscriptionModel
      .findOne({ profile: userId })
      .exec();

    const tariff = await this.tariffModel.findById(tariffId).exec();
    if (!tariff) {
      throw new NotFoundException('Неверный идентификатор тарифа');
    }
    if (subscription) {
      throw new BadRequestException('Подписка уже существует');
    }
    return await this.subscriptionModel.create({
      ...createSubscriptionDto,
      tariff: tariffId,
      status: true,
      profile: userId,
    });
    return await this.dbQuery.create(createSubscriptionDto);
  }

  async delete(id: number) {
    return await this.dbQuery.delete(id);
  }
}
