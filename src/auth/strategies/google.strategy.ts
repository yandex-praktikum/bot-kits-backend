import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

//-- Сервис для аутентификации через Google, наследует базовую стратегию Passport --//
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    //-- Конструктор класса, где происходит инициализация стратегии с конфигурационными параметрами --//
    super({
      clientID: configService.get('GOOGLE_APP_ID'), //-- Идентификатор приложения Google --//
      clientSecret: configService.get('GOOGLE_APP_SECRET'), //-- Секретный ключ приложения Google --//
      callbackURL: configService.get('GOOGLE_CALLBACK_URL'), //-- URL, на который Google будет перенаправлять после аутентификации --//
      scope: ['email', 'profile'], //-- Запрашиваемые у Google данные: email и профиль пользователя --//
    });
  }

  //-- Функция валидации, вызываемая после успешной аутентификации пользователя у Google --//
  async validate(
    accessToken: string, //-- Токен доступа, выданный Google --//
    refreshToken: string, //-- Токен для обновления доступа --//
    profile, //-- Профиль пользователя, полученный от Google --//
    done: (err: any, user: any, info?: any) => void, //-- Callback функция для передачи данных пользователя или ошибки --//
  ): Promise<any> {
    //-- Извлечение необходимых данных из профиля пользователя --//
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value, //-- Электронная почта пользователя --//
      username: `${name.givenName} ${name.familyName}`, //-- Полное имя пользователя --//
      avatar: photos[0].value, //-- Ссылка на аватар пользователя --//
      accessToken, //-- Токен доступа, может быть использован для доступа к API Google от имени пользователя --//
    };
    //-- Передача данных пользователя в NestJS через callback функцию --//
    done(null, user);
  }
}
