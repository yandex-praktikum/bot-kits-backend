import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { VerifyCallback } from 'jsonwebtoken';
import { Strategy, Profile as VkProfile } from 'passport-vkontakte';

//-- Сервис для реализации стратегии аутентификации через VK (ВКонтакте) --//
@Injectable()
export class VkontakteStrategy extends PassportStrategy(Strategy, 'vkontakte') {
  constructor(private readonly configService: ConfigService) {
    //-- Конструктор класса, где происходит инициализация стратегии с конфигурационными параметрами приложения VK --//
    super(
      {
        clientID: configService.get('VK_APP_ID'), //-- Идентификатор приложения VK --//
        clientSecret: configService.get('VK_APP_SECRET'), //-- Секретный ключ приложения VK --//
        callbackURL: configService.get('VK_CALLBACK_URL'), //-- URL, на который VK будет перенаправлять после аутентификации --//
        scope: ['profile', 'email'], //-- Запрашиваемые у VK данные: профиль и email пользователя --//
        profileFields: ['email'], //-- Указание конкретных полей профиля, которые необходимо получить --//
      },
      function (
        accessToken: string, //-- Токен доступа, выданный VK после аутентификации пользователя --//
        refreshToken: string, //-- Токен для обновления доступа --//
        profile: VkProfile, //-- Профиль пользователя, полученный от VK --//
        done: VerifyCallback, //-- Callback функция для передачи данных пользователя или ошибки --//
      ) {
        //-- Извлечение необходимых данных из профиля пользователя --//
        const { displayName, photos, emails } = profile;
        return done(null, {
          profile: {
            username: displayName, //-- Имя пользователя VK --//
            avatar: photos[0].value, //-- Ссылка на аватар пользователя --//
            email: emails[0].value, //-- Электронная почта пользователя (если доступна) --//
          },
          accessToken,
          refreshToken,
        });
      },
    );
  }
}
