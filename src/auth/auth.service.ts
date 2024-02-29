import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashService } from '../hash/hash.service';
import { Profile, ProfileDocument } from 'src/profiles/schema/profile.schema';
import { ProfilesService } from 'src/profiles/profiles.service';
import { AccountsService } from 'src/accounts/accounts.service';
import TypeAccount from 'src/accounts/types/type-account';
import { AuthDto } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Account } from 'src/accounts/schema/account.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { randomBytes } from 'crypto';
import { PartnershipService } from 'src/partnership/partnership.service';
import { TariffsService } from 'src/tariffs/tariffs.service';
import { SubscriptionsService } from 'src/subscriptions/subscriptions.service';
import { addDuration, createPaymentData } from 'src/utils/utils';
import { Payment } from 'src/payments/schema/payment.schema';
import TypeOperation from 'src/payments/types/type-operation';

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private profilesService: ProfilesService,
    private partnerShipService: PartnershipService,
    private accountsService: AccountsService,
    private hashService: HashService,
    private readonly configService: ConfigService,
    private tariffsService: TariffsService,
    private subscriptionsService: SubscriptionsService,
    @InjectModel(Payment.name) private paymentModel: mongoose.Model<Payment>,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}
  //-- Метод для генерации пары токенов доступа и обновления --//
  private async getTokens(profileId): Promise<ITokens> {
    //-- Базовый пейлоад для токенов, содержащий идентификатор профиля (sub) --//
    const basePayload = { sub: profileId };

    //-- Пейлоад для токена доступа с добавлением уникального идентификатора (jti) и указанием типа токена --//
    const accessTokenPayload = {
      ...basePayload,
      jti: randomBytes(16).toString('hex'), // Генерация случайного идентификатора JWT
      type: 'access',
    };

    //-- Пейлоад для токена обновления с добавлением уникального идентификатора (jti) и указанием типа токена --//
    const refreshTokenPayload = {
      ...basePayload,
      jti: randomBytes(16).toString('hex'), // Генерация случайного идентификатора JWT
      type: 'refresh',
    };

    //-- Создание токена доступа с использованием пейлоада токена доступа --//
    const accessToken = this.jwtService.sign(accessTokenPayload);

    //-- Создание токена обновления с использованием пейлоада токена обновления и установкой срока действия --//
    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      expiresIn: this.configService.get('REFRESHTOKEN_EXPIRESIN'), //-- Срок действия токена обновления --//
    });

    //-- Возвращение объекта с токенами доступа и обновления --//
    return { accessToken, refreshToken };
  }

  //-- Метод для аутентификации пользователя и получения токенов доступа и обновления --//
  async auth(profile: ProfileDocument): Promise<Account> {
    //-- Генерация токенов доступа и обновления для профиля пользователя --//
    const tokens = await this.getTokens(profile._id);

    //-- Сохранение токена обновления в базе данных и получение обновленного профиля --//
    const authProfile = await this.accountsService.saveRefreshToken(
      profile._id, //-- Идентификатор профиля пользователя --//
      tokens, //-- Сгенерированные токены --//
    );

    //-- Поиск и возвращение данных аккаунта пользователя по идентификатору и типу аккаунта --//
    return await this.accountsService.findByIdAndProvider(
      authProfile._id, //-- Идентификатор обновленного профиля пользователя --//
      TypeAccount.LOCAL, //-- Тип аккаунта, в данном случае локальный (LOCAL) --//
    );
  }

  //-- Метод для проверки пароля пользователя --//
  async validatePassword(
    accountEmail: string,
    password: string,
  ): Promise<Profile> {
    //-- Поиск аккаунта по электронной почте и типу аккаунта (в данном случае локальный аккаунт) --//
    const account = await this.accountsService.findByEmailAndType(
      accountEmail,
      TypeAccount.LOCAL,
    );

    //-- Если аккаунт не найден, выбрасывается исключение --//
    if (!account) {
      throw new UnauthorizedException('Неверное имя пользователя или пароль');
    } else {
      //-- Проверка соответствия введенного пароля сохраненному в базе данных --//
      const isPasswordMatched = await this.hashService.isPasswordCorrect(
        password, //-- Введенный пароль --//
        account.credentials.password, //-- Пароль, сохраненный в базе данных --//
      );

      //-- Если пароли не совпадают, выбрасывается исключение --//
      if (!isPasswordMatched) {
        throw new UnauthorizedException('Неверное имя пользователя или пароль');
      } else {
        //-- В случае успешной проверки возвращается профиль пользователя --//
        return account.profile;
      }
    }
  }

  async refreshToken(oldRefreshToken: string): Promise<ITokens> {
    //-- Проверяем, есть ли oldRefreshToken в базе данных и удаляем его --//
    const account = await this.accountsService.findAndDeleteRefreshToken(
      oldRefreshToken,
    );

    if (!account) {
      throw new UnauthorizedException('Невалидный refreshToken');
    }

    //-- Создаем новые accessToken и refreshToken --//
    const tokens = await this.getTokens(account.profile);

    //-- Обновляем refreshToken в базе данных --//
    await this.accountsService.saveRefreshToken(account.profile._id, tokens);

    return tokens;
  }

  //-- Метод для регистрации пользователя с возможностью указания типа аккаунта и реферальной ссылки --//
  async registration(
    authDto: AuthDto,
    typeAccount: TypeAccount = TypeAccount.LOCAL, //-- Тип аккаунта, по умолчанию LOCAL --//
    ref?: string, //-- Реферальная ссылка, необязательный параметр --//
  ): Promise<Account> {
    //-- Деструктуризация для извлечения данных профиля и аккаунта из DTO --//
    const { profileData, accountData } = authDto;

    //-- Извлечение email из данных аккаунта для последующей проверки --//
    const email = accountData.credentials.email;

    //-- Установка типа аккаунта в данные аккаунта --//
    accountData.type = typeAccount;

    let profile; //-- Переменная для хранения профиля пользователя --//

    //-- Запуск сессии MongoDB для поддержки транзакций --//
    const session = await this.connection.startSession();
    session.startTransaction(); //-- Начало транзакции --//

    try {
      //-- Проверка существования аккаунта с таким же email и типом аккаунта --//
      const existsAccountByTypeAndEmail =
        await this.accountsService.findByEmailAndType(
          email,
          typeAccount,
          session,
        );

      if (existsAccountByTypeAndEmail) {
        //-- Если аккаунт уже существует, выбрасываем исключение --//
        throw new ConflictException('Аккаунт уже существует');
      }

      //-- Проверка существования аккаунта только по email --//
      const existsAccount = await this.accountsService.findByEmail(
        email,
        session,
      );

      if (!existsAccount) {
        //-- Если аккаунт не найден, создаем новый профиль --//
        profile = await this.profilesService.create(profileData, session);

        //-- Обработка реферальной системы: генерация и обновление реферальной ссылки --//
        await this.partnerShipService.getPartnerRef(profile._id, session);
        await this.partnerShipService.updateRegistration(
          profile._id,
          ref,
          session,
        );

        //-- Инициализация подписки на демо-тариф для нового профиля --//
        const allTariffs = await this.tariffsService.findAll(session);
        const demoTariff = allTariffs.find((tariff) => tariff.isDemo === true);
        const currentDate = new Date();
        const duration = demoTariff.duration;
        const debitDate = await addDuration(currentDate, duration);

        const subscriptionData = {
          tariff: demoTariff,
          status: true,
          cardMask: '**** **** **** ****',
          debitDate: debitDate,
          profile: profile,
        };

        await this.subscriptionsService.initSubscription(
          subscriptionData,
          session,
        );

        //-- Создание записи о платеже за активацию демо-тарифа --//
        const paymentData = await createPaymentData(
          new Date(),
          demoTariff.price,
          true,
          TypeOperation.INCOME,
          'Активация Демо тарифа',
          profile,
          demoTariff.toObject(),
        );
        await this.paymentModel.create(paymentData);
      } else {
        //-- Если аккаунт существует, получаем профиль пользователя по email --//
        profile = await this.profilesService.findByEmail(email, session);
      }

      //-- Создание аккаунта с учетом указанного типа и привязки к профилю --//
      const newAccount = await this.accountsService.create(
        accountData,
        profile._id,
        session,
      );

      //-- Генерация токенов доступа для нового аккаунта --//
      const tokens = await this.getTokens(profile._id);

      //-- Обновление данных аккаунта с новыми токенами доступа --//
      accountData.credentials.accessToken = tokens.accessToken;
      accountData.credentials.refreshToken = tokens.refreshToken;
      await this.accountsService.update(newAccount._id, accountData, session);

      //-- Добавление аккаунта к списку аккаунтов пользователя и сохранение изменений --//
      profile.accounts.push(newAccount);
      await profile.save({ session });

      //-- Фиксация изменений в базе данных --//
      await session.commitTransaction();

      //-- Возвращение данных созданного аккаунта --//
      return await this.accountsService.findByIdAndProvider(
        profile._id,
        typeAccount,
      );
    } catch (error) {
      //-- В случае ошибки отменяем транзакцию и перебрасываем исключение --//
      await session.abortTransaction();
      throw error;
    } finally {
      //-- Завершаем сессию после выполнения всех операций --//
      session.endSession();
    }
  }

  async sendPasswordResetEmail(email) {
    const profile = await this.profilesService.findByEmail(email);
    if (!profile) {
      throw new NotFoundException('Пользователь с указанным Email не найден');
    }
    return {
      message: `Ссылка на сброс пароля отправлена на ваш email: ${email}`,
    };
  }

  //-- Метод для аутентификации пользователя через социальные сети --//
  async authSocial(dataLogin: AuthDto, typeAccount: TypeAccount) {
    //-- Деструктуризация для извлечения данных профиля и аккаунта из DTO --//
    const { accountData } = dataLogin;
    //-- Поиск пользователя по электронной почте и типу аккаунта --//
    const user = await this.accountsService.findByEmailAndType(
      accountData.credentials.email, //-- Электронная почта из данных для входа --//
      typeAccount, //-- Тип аккаунта (например, GOOGLE, YANDEX) --//
    );

    if (user) {
      //-- Если пользователь найден, генерируем для него токены доступа и обновления --//
      const { refreshToken, accessToken } = await this.getTokens(
        user.profile._id, //-- Идентификатор профиля пользователя --//
      );

      //-- Обновляем данные пользователя, включая новые токены --//
      await this.accountsService.update(user._id, {
        credentials: {
          email: user.credentials.email, //-- Подтверждаем электронную почту --//
          refreshToken, //-- Обновленный токен обновления --//
          accessToken, //-- Обновленный токен доступа --//
        },
      });

      //-- Возвращаем обновленные данные пользователя --//
      return this.accountsService.findByIdAndProvider(
        user.profile._id, //-- Идентификатор профиля пользователя --//
        typeAccount, //-- Тип аккаунта --//
      );
    }

    //-- Если пользователь не найден, производим регистрацию --//
    return await this.registration(
      dataLogin, //-- Данные для входа/регистрации --//
      typeAccount, //-- Тип аккаунта --//
      null, //-- Реферальная ссылка не используется --//
    );
  }

  //-- Метод для аутентификации пользователя через Яндекс --//
  async authYandex(codeAuth: string) {
    //-- Получение конфигурационных параметров для приложения Яндекс --//
    const CLIENT_ID = this.configService.get('YANDEX_APP_ID');
    const CLIENT_SECRET = this.configService.get('YANDEX_APP_SECRET');
    const TOKEN_URL = this.configService.get('YANDEX_TOKEN_URL');
    const USER_INFO_URL = this.configService.get('YANDEX_USER_INFO_URL');

    try {
      //-- Отправка запроса для получения токена доступа --//
      const tokenResponse = await axios.post(
        TOKEN_URL, //-- URL для получения токена --//
        `grant_type=authorization_code&code=${codeAuth}`, //-- Данные для запроса, включая код авторизации --//
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded', //-- Тип содержимого запроса --//
            Authorization: `Basic ${Buffer.from(
              `${CLIENT_ID}:${CLIENT_SECRET}`, //-- Кодирование учетных данных клиента в base64 --//
            ).toString('base64')}`,
          },
        },
      );
      //-- Извлечение токена доступа из ответа --//
      const accessToken = tokenResponse.data.access_token;

      //-- Запрос на получение данных пользователя с использованием токена доступа --//
      const userDataResponse = await axios.get(
        `${USER_INFO_URL}&oauth_token=${accessToken}`, //-- Добавление токена доступа к URL запроса --//
      );
      //-- Возвращение данных пользователя --//
      return userDataResponse;
    } catch (error) {
      //-- В случае ошибки выбрасывается HttpException с описанием ошибки --//
      throw new HttpException(
        'Ошибка в процессе авторизации через Яндекс', //-- Сообщение об ошибке --//
        HttpStatus.BAD_REQUEST, //-- Статус-код HTTP ошибки --//
      );
    }
  }

  //-- Метод для аутентификации пользователя через Mail.ru --//
  async authMailru(codeAuth: string) {
    //-- Получение конфигурационных данных для приложения Mail.ru из сервиса конфигурации --//
    const CLIENT_ID = this.configService.get('MAILRU_APP_ID');
    const CLIENT_SECRET = this.configService.get('MAILRU_APP_SECRET');
    const TOKEN_URL = this.configService.get('MAILRU_TOKEN_URL');
    const USER_INFO_URL = this.configService.get('MAILRU_USER_INFO_URL');

    //-- Кодирование CLIENT_ID и CLIENT_SECRET для использования в заголовке Authorization --//
    const authString = `${CLIENT_ID}:${CLIENT_SECRET}`;
    const encodedAuthString = Buffer.from(authString).toString('base64');

    try {
      //-- Отправка POST-запроса к Mail.ru для получения токена доступа --//
      const tokenResponse = await axios.post(
        TOKEN_URL, //-- URL для получения токена --//
        `grant_type=authorization_code&code=${codeAuth}&redirect_uri=${this.configService.get(
          'MAILRU_REDIRECT_URL',
        )}`, //-- Параметры запроса, включая код авторизации и URL перенаправления --//
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded', //-- Установка заголовка Content-Type --//
            Authorization: `Basic ${encodedAuthString}`, //-- Добавление заголовка Authorization с закодированными учетными данными --//
          },
        },
      );

      //-- Извлечение токена доступа из ответа --//
      const accessToken = tokenResponse.data.access_token;

      //-- Получение информации о пользователе с использованием токена доступа --//
      const userDataResponse = await axios.get(
        `${USER_INFO_URL}?access_token=${accessToken}`, //-- Добавление токена доступа к URL запроса на получение информации о пользователе --//
      );

      //-- Возвращение данных пользователя --//
      return userDataResponse.data;
    } catch (error) {
      //-- В случае ошибки выбрасывается исключение с описанием ошибки и статусом BAD_REQUEST --//
      throw new HttpException(
        'Ошибка в процессе авторизации через Mail.ru', //-- Сообщение об ошибке --//
        HttpStatus.BAD_REQUEST, //-- Код состояния HTTP для ошибки --//
      );
    }
  }
}
