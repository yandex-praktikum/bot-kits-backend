import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Subscription,
  SubscriptionDocument,
} from './schema/subscription.schema';
import mongoose, { Model } from 'mongoose';
import { Profile } from '../src/profiles/schema/profile.schema';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { ProfilesService } from 'src/profiles/profiles.service';
import { log } from 'console';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<SubscriptionDocument>,
    @InjectModel(Profile.name) private profile: Model<Profile>
  ) {}

  async subscriptionAndPayments(profile: string): Promise<string> {//Promise<object> {
    const user = this.profile.findById(new mongoose.mongo.ObjectId(profile));
    console.log((await user).username);
    return "Work!";
    // const subscription = await this.subscriptionModel.findById(
    //   profile.id//subscriptionId,
    // );
    // if (!subscription) {
    //   return {};
    // } else {
    //   return {
    //     tariff: '', //Дополнить именем тарифа из соотв-щей сущности
    //     status: subscription.status,
    //     cardMask: subscription.cardMask,
    //     debitDate: subscription.debitDate,
    //     payments: {}, //Дополнить данными платежей
    //   };
    // }
  }

  async activateSubscription(userId: string) {
    const profile = await this.profile.findById(new mongoose.mongo.ObjectId(userId)).exec();
    const subscription = await this.subscriptionModel.findOne({profile: profile}).exec();
    if (!subscription) {
      throw new NotFoundException('Не найдена подписка пользователя');
    }
    subscription.status = true;
    await subscription.save();
    return subscription;
  }

  async create(
    createSubscriptionDto: CreateSubscriptionDto, userId: string
  ): Promise<Subscription> {
    const profile = await this.profile.findById(new mongoose.mongo.ObjectId(userId)).exec();
    const subscription = await this.subscriptionModel.findOne({profile: profile}).exec();
    if (subscription) {
      this.delete(subscription.id);
    }
    return await this.subscriptionModel.create({
      ...createSubscriptionDto,
      status: true,
      profile: await this.profile.findById(new mongoose.mongo.ObjectId(userId)).exec()
    });
  }

  async delete(id: number) {
    return await this.subscriptionModel.findByIdAndRemove(id).exec();
  }

  async findOne(id: number): Promise<Subscription> {
    return this.subscriptionModel.findById(id).exec();
  }

  async findAll(): Promise<Subscription[]> {
    return await this.subscriptionModel.find().exec();
  }
}
