import { Injectable } from '@nestjs/common';
import mongoose, { ClientSession, Types } from 'mongoose';

import { ProfilesService } from 'src/profiles/profiles.service';
import { v4 as uuidv4 } from 'uuid';
import { PartnershipRepository } from './partnership.repository';
import { Partnership } from './schema/partnership.schema';
import { IPartnership, IWithdrawalRequest } from './schema/types';
import { PartnershipStatsDto } from './dto/partnership-stats.dto';
import { CreateWithdrawalRequestDto } from './dto/request-commission.dto';
import { WithdrawalResponseDto } from './dto/response-commission.dto';

@Injectable()
export class PartnershipService {
  constructor(
    private partnershipRepository: PartnershipRepository,
    private profileServices: ProfilesService,
  ) {}

  async getPartnerRef(
    id: string,
    session?: ClientSession,
    attempts = 0,
  ): Promise<string | null> {
    try {
      const maxAttempts = 5; // Максимальное количество попыток
      if (attempts >= maxAttempts) {
        throw new Error(
          'Failed to generate unique partner_ref after multiple attempts',
        );
      }

      const ref = uuidv4().slice(0, 7);
      const profileExists = await this.profileServices.findPartnerRef(ref);
      if (!profileExists) {
        // Обновляем partner_ref в профиле пользователя
        await this.profileServices.update(id, { partner_ref: ref }, session);

        // Получаем объект Profile по id
        const profile = await this.profileServices.findById(id);
        if (!profile) {
          throw new Error('Profile not found');
        }
        const partnership = await this.partnershipRepository.findByPartnerRef(
          ref,
        );
        if (!partnership) {
          // Если нет существующего партнерства с таким ref, создаем новое
          await this.partnershipRepository.create(
            {
              profile: profile._id, // profile._id для ссылки на документ
              partner_ref: ref,
              visited_ref: [],
              registration_ref: [],
              monthlyStats: [],
              withdrawalRequests: [],
            },
            session,
          );
        }
        return ref; // Возвращаем ref, если профиль и партнерство обновлены
      } else {
        // Если профиль с таким partner_ref уже существует, повторить попытку с увеличением счетчика попыток
        return this.getPartnerRef(id, session, attempts + 1);
      }
    } catch (error) {
      throw error;
    }
  }

  isPaymentInCurrentMonth = (paymentDate: Date, monthYear: string): boolean => {
    // Преобразование даты платежа в формат 'MM-YYYY'
    const paymentMonthYear = paymentDate.toISOString().slice(0, 7);

    // Сравнение строки даты платежа с переданным monthYear
    return paymentMonthYear === monthYear;
  };

  // Метод для добавления записи о посещении
  async addVisitedRef(
    partner_ref: string,
    session?: ClientSession,
  ): Promise<Partnership | null> {
    try {
      // Находим партнерство по partner_ref
      const partnership = await this.partnershipRepository.findByPartnerRef(
        partner_ref,
      );
      if (partnership) {
        // Добавляем новую запись о посещении
        partnership.visited_ref.push({ timestamp: new Date() });

        // Сохраняем обновленное партнерство
        return await this.partnershipRepository.save(partnership, session);
      } else {
        console.log(`Partnership with partner_ref ${partner_ref} not found.`);
        return null;
      }
    } catch (error) {
      console.error('Error adding visited_ref:', error);
      throw error;
    }
  }

  async registerUserWithPayment(
    newUserId: Types.ObjectId,
    partner_ref: string,
    paymentAmount: number,
    paymentDate: Date,
  ): Promise<IPartnership | null> {
    // Здесь предполагается, что partnerRef уже извлечен из реферальной ссылки при регистрации пользователя

    // Проверяем, существует ли уже запись в registration_ref для этого пользователя
    const existingPartnership =
      await this.partnershipRepository.findByPartnerRef(partner_ref);
    if (existingPartnership) {
      // Если пользователь уже зарегистрирован через реферальную ссылку, просто добавляем информацию о платеже
      return await this.partnershipRepository.addPaymentToRegistrationRef(
        partner_ref,
        {
          profileId: newUserId,
          paymentDate: paymentDate,
          amount: paymentAmount,
        },
      );
    } else {
      // Получаем объект Profile по id
      const profile = await this.profileServices.findById(newUserId.toString());
      if (!profile) {
        throw new Error('Profile not found');
      }

      // Создаем новую запись в Partnership для данного partnerRef
      const newPartnership = await this.partnershipRepository.create({
        profile: profile.id, // Необходимо указать профиль
        partner_ref: partner_ref,
        visited_ref: [],
        registration_ref: [
          {
            profileId: newUserId,
            timestamp: new Date(),
            paymentAmount: paymentAmount,
            payments: [
              {
                paymentDate: paymentDate,
                amount: paymentAmount,
              },
            ],
          },
        ],
        monthlyStats: [],
        withdrawalRequests: [],
      });
      if (newPartnership) {
        console.log(
          `New partnership record created for partnerRef: ${partner_ref} with new user ID: ${newUserId}`,
        );
        return newPartnership;
      } else {
        console.log('Failed to create new partnership record.');
        return null;
      }
    }
  }

  async recordPayment(
    userId: Types.ObjectId,
    amount: number,
    paymentDate: Date,
  ): Promise<void> {
    // Получаем профиль пользователя по ID
    const userProfile = await this.profileServices.findById(userId.toString());
    if (!userProfile || !userProfile.partner_ref) {
      throw new Error('Profile not found or no partner reference');
    }

    // Находим запись в Partnership по partner_ref
    const partnership = await this.partnershipRepository.findByPartnerRef(
      userProfile.partner_ref,
    );
    if (!partnership) {
      console.log(
        `No partnership record found for partner_ref: ${userProfile.partner_ref}`,
      );
      return;
    }

    // Проверяем, существует ли уже запись с этим profileId в registration_ref
    const registrationIndex = partnership.registration_ref.findIndex((reg) =>
      reg.profileId.equals(userId),
    );

    if (registrationIndex !== -1) {
      // Если запись найдена, добавляем платеж к существующим
      partnership.registration_ref[registrationIndex].payments.push({
        paymentDate: paymentDate,
        amount: amount,
      });
    } else {
      // Если запись не найдена, создаем новую
      partnership.registration_ref.push({
        profileId: userId,
        timestamp: new Date(),
        paymentAmount: amount,
        payments: [{ paymentDate, amount }],
      });
    }
    // Сохраняем обновленное партнерство
    await partnership.save();
  }
  async updateMonthlyStats(
    partnerRef: string,
    monthYear: string,
  ): Promise<void> {
    const partnership = await this.partnershipRepository.findByPartnerRef(
      partnerRef,
    );
    if (!partnership) throw new Error('Partnership not found');

    // Предположим, что monthYear передается в формате 'MM-YYYY'
    let monthlyStat = partnership.monthlyStats.find(
      (stat) => stat.month === monthYear,
    );
    // Инициализация или поиск существующей записи статистики за текущий месяц

    if (!monthlyStat) {
      monthlyStat = {
        month: monthYear,
        visits: 0,
        registrations: partnership.registration_ref.length,
        paymentsCount: 0,
        paymentsAmount: 0,
        commissionAmount: 0,
        availableForWithdrawal: 0,
      };
      partnership.monthlyStats.push(monthlyStat);
    }

    partnership.registration_ref.forEach((registration) => {
      registration.payments.forEach((payment) => {
        const paymentDate = new Date(payment.paymentDate);
        if (this.isPaymentInCurrentMonth(paymentDate, monthYear)) {
          monthlyStat.paymentsCount += 1;
          monthlyStat.paymentsAmount += payment.amount;
        }
      });
    });

    monthlyStat.commissionAmount = monthlyStat.paymentsAmount * 0.3;

    // Вычислите и обновите availableForWithdrawal
    const totalWithdrawn = partnership.withdrawalRequests
      .filter(
        (req) =>
          req.status === 'Paid' &&
          new Date(req.paymentDate).toISOString().slice(0, 7) === monthYear,
      )
      .reduce((acc, curr) => acc + curr.amount, 0);

    monthlyStat.availableForWithdrawal =
      monthlyStat.commissionAmount - totalWithdrawn;

    await this.partnershipRepository.save(partnership);
  }

  async createWithdrawalRequestStat(
    partnerRef: string,
    requestAmount: number,
    requestDate: Date,
  ): Promise<void> {
    const partnership = await this.partnershipRepository.findByPartnerRef(
      partnerRef,
    );
    if (!partnership) throw new Error('Partnership not found');

    // Используем приведение типа для 'status'
    const newRequest: IWithdrawalRequest = {
      requestDate,
      paymentDate: null,
      status: 'Processing' as const, // Явно указываем тип
      amount: requestAmount,
    };
    partnership.withdrawalRequests.push(newRequest);

    // обновление availableForWithdrawal для текущего месяца
    const monthYear = requestDate.toISOString().slice(0, 7); // 'YYYY-MM'
    await this.updateMonthlyStats(partnerRef, monthYear);

    await this.partnershipRepository.save(partnership);
  }

  async getPartnershipStats(partnerRef: string): Promise<PartnershipStatsDto> {
    const partnership = await this.partnershipRepository.findByPartnerRef(
      partnerRef,
    );
    if (!partnership) {
      throw new Error('Partnership not found');
    }

    // Формируем DTO
    const statsDto: PartnershipStatsDto = {
      referralLink: `https://example.com/referral?code=${partnerRef}`, // Пример формирования реферальной ссылки
      monthlyStats: partnership.monthlyStats.map((stat) => ({
        month: stat.month,
        visits: stat.visits,
        registrations: stat.registrations,
        paymentsCount: stat.paymentsCount,
        paymentsAmount: stat.paymentsAmount,
        commissionAmount: stat.commissionAmount,
        availableForWithdrawal: stat.availableForWithdrawal,
      })),
      withdrawalRequests: partnership.withdrawalRequests.map((req) => ({
        requestDate: req.requestDate,
        paymentDate: req.paymentDate,
        status: req.status,
        amount: req.amount,
      })),
    };

    return statsDto;
  }

  async createWithdrawalRequest(
    userId: string,
    createDto: CreateWithdrawalRequestDto,
  ): Promise<WithdrawalResponseDto> {
    const userProfile = await this.profileServices.findById(userId);
    if (!userProfile) {
      throw new Error('User profile not found');
    }

    const partnerRef = userProfile.partner_ref;
    const partnership = await this.partnershipRepository.findByPartnerRef(
      partnerRef,
    );
    if (!partnership) {
      throw new Error('Partnership not found');
    }

    // Проверка доступной суммы для вывода
    if (createDto.amount > partnership.monthlyStats[0].availableForWithdrawal) {
      throw new Error('Requested amount exceeds available funds');
    }

    // Создание запроса на вывод средств
    const newRequest: IWithdrawalRequest = {
      requestDate: new Date(),
      paymentDate: null, // Пока не оплачено
      status: 'Processing',
      amount: createDto.amount,
    };
    partnership.withdrawalRequests.push(newRequest);

    await this.partnershipRepository.save(partnership);

    // Формирование ответа
    return {
      status: newRequest.status,
      availableForWithdrawal:
        partnership.monthlyStats[0].availableForWithdrawal - createDto.amount, // Предполагается обновление этой суммы
    };
  }
}
