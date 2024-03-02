import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { SanitizePipe } from './utils/pipe/sanitize.pipe';
import { AppClusterService } from './appCluster/appCluster.service';
import { LoggerFactory } from './utils/loggerFactory';
import 'reflect-metadata';

//-- Подключение глобального обработчика для перехвата необработанных исключений и отклоненных промисов --//
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  Logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

//-- Асинхронная функция для инициализации и запуска NestJS приложения --//
async function bootstrap() {
  //-- Создание экземпляра приложения с пользовательским логгером --//
  const app = await NestFactory.create(AppModule, {
    logger: LoggerFactory('Botkits Logger'),
  });

  //-- Получение сервиса конфигурации и настройка глобального префикса для всех маршрутов --//
  const configService = app.get(ConfigService);
  app.setGlobalPrefix(configService.get('GLOBAL_PREFIX'));

  //-- Установка порта из конфигурации --//
  const port = configService.get('APP_PORT');

  //-- Настройка глобальных пайпов для валидации и санитизации входных данных --//
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //-- Игнорировать свойства объектов, не описанные в DTO --//
      forbidNonWhitelisted: true, //-- Запретить неизвестные свойства --//
      transform: true, //-- Преобразование входных данных к соответствующим DTO классам --//
      exceptionFactory: (errors) => new BadRequestException(errors), //-- Фабрика исключений для ошибок валидации --//
    }),
    new SanitizePipe(), //-- Пайп для санитизации входных данных
  );

  //-- Применение промежуточного ПО Helmet для увеличения безопасности приложения --//
  app.use(helmet());

  //-- Настройка CORS --//
  const cors = {
    origin: '*', //-- Разрешить запросы с любого источника --//
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', //-- Разрешенные HTTP-методы --//
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'], //-- Разрешенные заголовки --//
    credentials: true, //-- Поддержка учетных данных --//
  };
  app.enableCors(cors);

  //-- Настройка Swagger для автогенерации документации API --//
  const config = new DocumentBuilder()
    .setTitle('API BotKits')
    .setDescription('Ручки для команды frontend')
    .setVersion('1.0')
    .addTag('auth', 'Авторизация пользователей')
    .addTag('accounts', 'Аккаунты пользователей')
    .addTag('profiles', 'Профили пользователей')
    .addTag('bots', 'Боты')
    .addTag('botAccesses', 'Управление доступами к ботам')
    .addTag('platforms', 'Подключаемые платформы')
    .addTag('tariffs', 'Тарифы работы с площадкой')
    .addTag('subscriptions', 'Подписки пользователей на тарифы')
    .addTag('payments', 'Платежи пользователей')
    .addTag('promocodes', 'Промокоды')
    .addTag('notification', 'Уведомления пользователей')
    .addBearerAuth() //-- Настройка схемы авторизации --//
    .build(); //-- Завершаем конфигурирование вызовом build --//

  //-- Создание документа Swagger и его экспорт в формате YAML --//
  const document = SwaggerModule.createDocument(app, config);
  const yamlDocument = yaml.dump(document);
  fs.writeFileSync('./swagger.yaml', yamlDocument, 'utf8');

  //-- Настройка маршрута для доступа к документации через веб-интерфейс --//
  SwaggerModule.setup(
    `${configService.get('GLOBAL_PREFIX')}/docs`,
    app,
    document,
  );

  //-- Запуск приложения на указанном порте --//
  await app.listen(port);
}

//-- Запуск приложения с возможностью масштабирования (в данном случае без масштабирования) --//
AppClusterService.clusterize(bootstrap, 1);
