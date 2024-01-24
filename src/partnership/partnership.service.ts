import { Injectable } from '@nestjs/common';
import { ClientSession, Types } from 'mongoose';
import { PaymentsService } from 'src/payments/payments.service';
import TypeOperation from 'src/payments/types/type-operation';

import { ProfilesService } from 'src/profiles/profiles.service';
import { Profile } from 'src/profiles/schema/profile.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PartnershipService {
  constructor(
    private profileServices: ProfilesService,
    private paymentsService: PaymentsService,
  ) {}

  async getPartnerRef(id: string, session?: ClientSession) {
    try {
      const ref = uuidv4().slice(0, 7);
      const profile = await this.profileServices.findPartnerRef(ref);
      if (!profile) {
        await this.profileServices.update(id, { partner_ref: ref }, session);
        return ref; // Возвращаем ref, если профиль обновлен
      } else {
        // Если профиль с таким partner_ref уже существует, повторить попытку
        return this.getPartnerRef(id);
      }
    } catch (error) {
      throw error;
    }
  }

  async updateVisited(ref: string): Promise<Profile> {
    const profile = await this.profileServices.findPartnerRef(ref);

    if (!profile) {
      return;
    }

    profile.visited_ref += 1;

    return await this.profileServices.update(profile._id, {
      visited_ref: profile.visited_ref,
    });
  }

  async updateRegistration(
    refferProfileId: Types.ObjectId,
    ref?: string,
    session?: ClientSession,
  ): Promise<Profile> {
    if (!ref) {
      return;
    }

    const profile = await this.profileServices.findPartnerRef(ref);

    if (!profile) {
      return;
    }

    profile.registration_ref += 1;
    profile.referredUsers.push(refferProfileId);

    return await this.profileServices.update(
      profile._id,
      {
        registration_ref: profile.registration_ref,
      },
      session,
    );
  }

  async getStatistic(userId: string) {
    const profile = await this.profileServices.findById(userId);

    // Создаем массив промисов для получения платежей каждого реферального пользователя
    const paymentsPromises = profile.referredUsers.map((refUser) =>
      this.paymentsService.findUsersAll(refUser),
    );

    // Ожидаем выполнения всех промисов
    const allPayments = await Promise.all(paymentsPromises);

    // Объединяем все платежи в один массив и фильтруем их
    const filteredPayments = allPayments
      .flat()
      .filter(
        (payment) =>
          payment.operation === TypeOperation.OUTGONE &&
          !payment.promocode &&
          payment.successful &&
          payment.amount > 0,
      );

    // // Сортируем платежи по дате
    // filteredPayments.sort((a, b) => a.createdAt - b.createdAt);

    return filteredPayments;
  }
}
