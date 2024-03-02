import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import TelegramStrategy from 'passport-telegram-official';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

//-- Сервис для реализации стратегии аутентификации через Telegram --//
@Injectable()
export class TelegaStrategy extends PassportStrategy(
  TelegramStrategy,
  'telegram',
) {
  constructor(private readonly configService: ConfigService) {
    //-- Конструктор класса, где происходит инициализация стратегии с параметрами бота Telegram --//
    super(
      {
        botToken: configService.get('TELEGRAM_BOT_TOKEN'), //-- Токен Telegram бота, полученный при его создании --//
        passReqToCallback: true, //-- Передача объекта запроса (req) в callback функцию --//
      },
      async (req, user, done) => {
        //-- Асинхронная функция обратного вызова для обработки полученных данных пользователя от Telegram --//
        req.user = user; //-- Присвоение данных пользователя объекту запроса --//
        if (await this.validate(user)) {
          //-- Проверка подлинности данных пользователя через метод validate --//
          return done(null, user); //-- В случае успеха, возвращаем пользователя --//
        } else {
          throw new UnauthorizedException(); //-- В случае ошибки выбрасываем исключение UnauthorizedException --//
        }
      },
    );
  }

  //-- Метод для валидации данных пользователя, полученных от Telegram --//
  async validate(query: any): Promise<boolean> {
    //-- Извлечение данных пользователя из запроса --//
    const { id, first_name, username, auth_date, hash } = query;
    const botToken = this.configService.get('TELEGRAM_BOT_TOKEN'); //-- Получение токена бота из конфигурации --//
    //-- Формирование строки для проверки подписи (hash) --//
    const dataCheckString = `auth_date=${auth_date}\nfirst_name=${first_name}\nid=${id}\nusername=${username}`;
    //-- Генерация секретного ключа из токена бота --//
    const secretKey = crypto.createHash('sha256').update(botToken).digest();
    //-- Вычисление hash на основе полученных данных и секретного ключа --//
    const hashCheck = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    //-- Сравнение полученного hash с тем, что предоставлен Telegram --//
    return hash === hashCheck;
  }
}
