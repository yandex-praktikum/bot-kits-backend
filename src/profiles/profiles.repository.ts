import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { ClientSession, Model, Types } from 'mongoose';
import { CreateProfileDto } from './dto/create-profile.dto';
import { Access, Profile } from './schema/profile.schema';
import { Account } from 'src/accounts/schema/account.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateSharedAccessDto } from './dto/create-access.dto';
import { Bot } from 'src/bots/schema/bots.schema';
import { Subscription } from 'src/subscriptions/schema/subscription.schema';
import { Tariff } from 'src/tariffs/schema/tariff.schema';
import Role from 'src/accounts/types/role';

// Определение типа для ответа функции findAll
export type TAllUsersResponse = {
  id: Types.ObjectId;
  name: string;
  mail: string;
  phone: string;
  botCount: number;
  dateRegistration: Date;
  lastActivityAccount: Date; // Эти поля могут требовать дополнительной логики для точного заполнения
  lastActivityBot: Date;
  tariff: Tariff | null; // Указываем, что может быть null, если подписка не найдена
  debitDate: Date | null; // То же, что и для tariff
};

@Injectable()
export class ProfilesRepository {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
    @InjectModel(Account.name) private accountModel: Model<Account>,
    @InjectModel(Bot.name) private botModel: Model<Bot>,
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<Subscription>,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async findAll(): Promise<TAllUsersResponse[]> {
    // Извлекаем всех пользователей и их аккаунты
    const allUsers = await this.profileModel.find().populate('accounts').exec();

    // Маппинг пользователей в асинхронные промисы для обработки данных
    const responseUsersPromises = allUsers.map(async (user) => {
      // Пропускаем пользователей с ролью SUPER_ADMIN
      if (user.accounts[0].role === Role.SUPER_ADMIN) return null;

      // Получаем количество ботов пользователя
      const allBotsUser = await this.botModel.find({ profile: user._id });

      // Пытаемся найти подписку пользователя
      const subscriptionUser = await this.subscriptionModel
        .findOne({ 'profile._id': user._id })
        .exec();

      // Структурируем ответ с проверками на null для подписки
      return {
        id: user._id,
        name: user.username,
        mail: user.accounts[0].credentials.email, // Используем исправленное название поля
        phone: user.phone,
        botCount: allBotsUser.length,
        dateRegistration: user.dateRegistration, // Используем дату создния из модели пользователя
        lastActivityAccount: user.lastAccountActivity
          ? user.lastAccountActivity
          : new Date(), // Требует реализации
        lastActivityBot: new Date(), // Требует реализации
        tariff: subscriptionUser ? subscriptionUser.tariff : null,
        debitDate: subscriptionUser ? subscriptionUser.debitDate : null,
      };
    });

    // Ожидаем выполнения всех промисов и фильтруем null значения
    const responseUsers = await Promise.all(responseUsersPromises);
    return responseUsers.filter((user) => user !== null);
  }

  private async createDefaultAccessObject(
    profileId: Types.ObjectId,
  ): Promise<Access> {
    return {
      profile: profileId,
      dashboard: true,
      botBuilder: true,
      mailing: false,
      statistics: false,
    };
  }

  async create(
    createProfileDto: CreateProfileDto,
    session?: mongoose.ClientSession,
  ): Promise<Profile | null> {
    const profileNew = new this.profileModel(createProfileDto);
    if (session) {
      return await profileNew.save({ session: session });
    }
    return await profileNew.save();
  }

  async findOne(id: string | number): Promise<Profile> {
    return await this.profileModel.findById(id).exec();
  }

  async findAccountsByProfileId(id: string): Promise<Account[]> {
    const profile = await this.findById(id);
    return profile.accounts;
  }

  async findAccountByToken(token: string) {
    return await this.accountModel
      .findOne({
        'credentials.accessToken': token,
      })
      .populate('profile');
  }

  async findAccountByEmail(
    email: string,
    session?: mongoose.ClientSession,
  ): Promise<Account | null> {
    return await this.accountModel
      .findOne({ 'credentials.email': email }, { 'credentials.password': 0 })
      .session(session)
      .populate('profile');
  }

  async findById(id: string): Promise<Profile> {
    const foundProfile = await this.profileModel.findById(id);

    if (!foundProfile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }

    const profile = await foundProfile.populate('accounts');
    profile.accounts.forEach((account) => {
      if (account.credentials) {
        delete account.credentials.password;
      }
    });

    return profile;
  }

  async findByPartnerRef(ref: string): Promise<Profile | null> {
    return await this.profileModel.findOne({ partner_ref: ref });
  }

  async update(
    id: string,
    updateProfileDto: UpdateProfileDto,
    session?: ClientSession,
  ): Promise<Profile> {
    return await this.profileModel
      .findByIdAndUpdate(id, updateProfileDto, {
        new: true,
      })
      .session(session);
  }

  async remove(id: string): Promise<Profile> {
    return await this.profileModel.findByIdAndDelete(id).exec();
  }

  async sharedAccess(
    createSharedAccessDto: CreateSharedAccessDto,
    userId: string,
  ) {
    // Начинаем сессию и транзакцию для работы с БД
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      // Находим аккаунт получателя доступа по адресу электронной почты
      const recipientAccount = await this.accountModel.findOne(
        { 'credentials.email': createSharedAccessDto.email },
        { 'credentials.password': 0 },
      );
      if (!recipientAccount) {
        throw new NotFoundException('Профиль получателя не найден');
      }

      // Проверяем, найден ли соответствующий профиль пользователя получателя
      const recipientProfile = await this.profileModel
        .findById(recipientAccount.profile)
        .exec();

      if (!recipientProfile) {
        throw new NotFoundException('Профиль получателя не найден');
      }

      // Поиск профиля пользователя, предоставляющего доступ, по идентификатору
      const grantingProfile = await this.profileModel.findById(userId);

      if (!grantingProfile) {
        throw new NotFoundException(
          'Профиль предоставляющего доступ не найден',
        );
      }

      // Проверка на то, был ли доступ уже предоставлен этому пользователю
      const accessAlreadyGranted = recipientProfile.receivedSharedAccess.some(
        (access) => access.profile.toString() === userId,
      );

      if (accessAlreadyGranted) {
        throw new ConflictException(
          'Доступ уже был предоставлен этому пользователю',
        );
      }

      // Добавление записей о предоставленном доступе в профили пользователей
      recipientProfile.receivedSharedAccess.push(
        await this.createDefaultAccessObject(
          new mongoose.Types.ObjectId(userId),
        ),
      );
      grantingProfile.grantedSharedAccess.push(
        await this.createDefaultAccessObject(
          new mongoose.Types.ObjectId(recipientProfile._id),
        ),
      );

      // Сохранение изменений в профилях пользователей в БД
      await recipientProfile.save({ session });
      await grantingProfile.save({ session });

      // Фиксация транзакции
      await session.commitTransaction();

      // Возвращаем обновленные профили
      return { recipientProfile, grantingProfile };
      // return `Функционал уведосления на email - ${createSharedAccessDto.email} с сообщением о предоставленном доступе`
    } catch (e) {
      // В случае ошибки откатываем транзакцию
      await session.abortTransaction();
      return e;
    } finally {
      // Завершаем сессию вне зависимости от результата
      session.endSession();
    }
  }

  async findAllGrantedAccesses(userId: string): Promise<any> {
    const profile = await this.profileModel
      .findById(userId)
      .populate({
        path: 'grantedSharedAccess',
        populate: {
          path: 'profile',
          model: 'Profile',
          populate: {
            path: 'accounts',
            model: 'Account',
          },
        },
      })
      .exec();

    if (!profile) {
      throw new NotFoundException('Профиль не найден');
    }

    // Убедитесь, что profile.grantedSharedAccess соответствует ожидаемому типу
    const accesses = profile.grantedSharedAccess as any;

    // Трансформация результатов
    const transformedAccesses = accesses.map((access) => {
      const username = access.profile.username;
      const email =
        access.profile.accounts.length > 0
          ? access.profile.accounts[0].credentials.email
          : null;

      return {
        _id: access.profile._id,
        username,
        email,
        dashboard: access.dashboard,
        botBuilder: access.botBuilder,
        mailing: access.mailing,
        statistics: access.statistics,
      };
    });

    return transformedAccesses;
  }

  async updateAccesses(grantorId: string, access: Access): Promise<Access[]> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const grantorProfile = await this.profileModel
        .findById(grantorId)
        .session(session);
      const grantedUserProfile = await this.profileModel
        .findById(access.profile)
        .session(session);

      if (!grantorProfile || !grantedUserProfile) {
        throw new NotFoundException('Профиль не найден');
      }

      // Обновление grantedSharedAccess у пользователя, который выдал доступ
      const grantorAccessIndex = grantorProfile.grantedSharedAccess.findIndex(
        (a) => a.profile.toString() === access.profile.toString(),
      );

      if (grantorAccessIndex !== -1) {
        grantorProfile.grantedSharedAccess[grantorAccessIndex] = access;
      } else {
        grantorProfile.grantedSharedAccess.push(access);
      }

      // Обновление receivedSharedAccess у пользователя, которому был выдан доступ
      const grantedAccessIndex =
        grantedUserProfile.receivedSharedAccess.findIndex(
          (a) => a.profile.toString() === grantorId,
        );
      if (grantedAccessIndex !== -1) {
        grantedUserProfile.receivedSharedAccess[grantedAccessIndex] = {
          ...access,
          profile: grantorProfile._id,
        };
      } else {
        grantedUserProfile.receivedSharedAccess.push({
          ...access,
          profile: grantorProfile._id,
        });
      }

      await grantorProfile.save({ session });
      await grantedUserProfile.save({ session });

      await session.commitTransaction();

      return grantorProfile.grantedSharedAccess;
    } catch (e) {
      await session.abortTransaction();
      return e;
    } finally {
      session.endSession();
    }
  }
}
