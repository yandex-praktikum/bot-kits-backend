import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ThrottlerAsyncOptions,
  ThrottlerModuleOptions,
} from '@nestjs/throttler';

//-- Функция для конфигурации опций модуля Throttler, используемого для ограничения частоты запросов --//
const throttlerOptions = (
  configService: ConfigService, //-- Сервис для доступа к конфигурации приложения --//
): ThrottlerModuleOptions => [
  {
    //-- Установка времени жизни (TTL) для записей о запросах в миллисекундах --//
    ttl: +configService.get('THROTTLE_TIME_WINDOW_SECONDS') * 1000,
    //-- Установка максимального количества разрешенных запросов в течение TTL --//
    limit: configService.get('THROTTLE_REQUESTS_LIMIT'),
  },
];

//-- Функция для асинхронной конфигурации модуля Throttler --//
export const throttlerConfig = (): ThrottlerAsyncOptions => ({
  imports: [ConfigModule], //-- Импорт модуля конфигурации для доступа к ConfigService --//
  inject: [ConfigService], //-- Внедрение зависимости ConfigService --//
  //-- Фабрика, использующая ConfigService для создания конфигурации модуля Throttler --//
  useFactory: (configService: ConfigService) => throttlerOptions(configService),
});
