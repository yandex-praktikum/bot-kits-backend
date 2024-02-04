import { Injectable } from '@nestjs/common';
import { Subscription } from './schema/subscription.schema';
import { Profile } from '../profiles/schema/profile.schema';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SubscriptionsRepository } from './subscriptions.repository';
import mongoose from 'mongoose';

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
    user: Profile,
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Subscription> {
    return await this.dbQuery.create(createSubscriptionDto, tariffId, user);
  }

  async initSubscription(
    subscriptioData,
    session?: mongoose.ClientSession,
  ): Promise<Subscription> {
    return await this.dbQuery.initSubscription(subscriptioData, session);
  }

  async delete(id: number) {
    return await this.dbQuery.delete(id);
  }
}
