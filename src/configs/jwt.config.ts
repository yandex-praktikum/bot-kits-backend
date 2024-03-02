import { ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions, JwtModuleOptions } from '@nestjs/jwt';

//-- Функция для конфигурации опций модуля JWT --//
const jwtModuleOptions = (configService: ConfigService): JwtModuleOptions => ({
  //-- Использование секретного ключа из конфигурации для подписи токенов --//
  secret: configService.get('JWT_SECRET'),
  signOptions: {
    //-- Установка времени жизни токена, по умолчанию 1 день --//
    expiresIn: configService.get('JWT_EXPIRES', '1d'),
  },
});

//-- Функция для асинхронной конфигурации JWT модуля --//
export const jwtOptions = (): JwtModuleAsyncOptions => ({
  inject: [ConfigService], //-- Внедрение сервиса конфигурации --//
  //-- Фабрика для создания конфигурации модуля JWT с использованием ConfigService --//
  useFactory: (configService: ConfigService) => jwtModuleOptions(configService),
});
