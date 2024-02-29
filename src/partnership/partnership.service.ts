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

  //-- Метод для генерации и сохранения реферальной ссылки для партнерской программы --//
  async getPartnerRef(id: string, session?: ClientSession) {
    try {
      //-- Генерация уникального короткого кода для реферальной ссылки --//
      const ref = uuidv4().slice(0, 7);

      //-- Проверка на уникальность сгенерированного кода в базе данных --//
      const profile = await this.profileServices.findPartnerRef(ref);

      if (!profile) {
        //-- Если профиль с таким реферальным кодом не найден, сохраняем код в профиле пользователя --//
        await this.profileServices.update(id, { partner_ref: ref }, session);
        //-- Возвращаем сгенерированный реферальный код --//
        return ref;
      } else {
        //-- Если найден профиль с таким же реферальным кодом, повторяем попытку генерации --//
        return this.getPartnerRef(id);
      }
    } catch (error) {
      //-- В случае ошибок при работе с базой данных выбрасываем исключение --//
      throw error;
    }
  }

  //-- Метод для обновления счетчика переходов по реферальной ссылке --//
  async updateVisited(ref: string): Promise<Profile> {
    //-- Поиск профиля пользователя по реферальному коду --//
    const profile = await this.profileServices.findPartnerRef(ref);

    //-- Если профиль не найден, прекращаем выполнение метода --//
    if (!profile) {
      return;
    }

    //-- Увеличиваем счетчик посещений по реферальной ссылке на единицу --//
    profile.visited_ref += 1;

    //-- Сохраняем обновленный профиль с увеличенным счетчиком переходов --//
    return await this.profileServices.update(profile._id, {
      visited_ref: profile.visited_ref,
    });
  }

  //-- Метод для обновления данных регистрации через реферальную ссылку --//
  async updateRegistration(
    refferProfileId: Types.ObjectId,
    ref?: string,
    session?: ClientSession,
  ): Promise<Profile> {
    //-- Если реферальный код не предоставлен, прекращаем выполнение метода --//
    if (!ref) {
      return;
    }

    //-- Поиск профиля по реферальному коду --//
    const profile = await this.profileServices.findPartnerRef(ref);

    //-- Если профиль по реферальному коду не найден, прекращаем выполнение метода --//
    if (!profile) {
      return;
    }

    //-- Увеличение счетчика регистраций по реферальной ссылке --//
    profile.registration_ref += 1;
    //-- Добавление ID привлеченного пользователя в массив referredUsers профиля, который распространял реферальную ссылку --//
    profile.referredUsers.push(refferProfileId);

    //-- Сохранение обновленных данных профиля --//
    return await this.profileServices.update(
      profile._id, //-- ID профиля, распространяющего реферальную ссылку --//
      {
        registration_ref: profile.registration_ref, //-- Обновленный счетчик регистраций --//
      },
      session, //-- Использование сессии MongoDB, если она предоставлена --//
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
