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

@Injectable()
export class ProfilesRepository {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
    @InjectModel(Account.name) private accountModel: Model<Account>,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  private async createDefaultAccessObject(
    profileId: Types.ObjectId,
  ): Promise<Access> {
    return {
      profile: profileId,
      dashboard: true,
      botBuilder: true,
      mailing: false,
      static: false,
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

  async findAll(): Promise<Profile[]> {
    return await this.profileModel.find().exec();
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

  async findAllGrantedAccesses(userId: string): Promise<Access[]> {
    const profile = await this.profileModel.findById(userId);

    if (!profile) {
      throw new NotFoundException('Профиль не найден');
    }

    return profile.grantedSharedAccess;
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
