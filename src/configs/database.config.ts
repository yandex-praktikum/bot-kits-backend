import {
  MongooseModuleAsyncOptions,
  MongooseModuleOptions,
} from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { MongoClient } from 'mongodb';
import { botTemplates } from 'src/bots/dto/constants/botTemplates';
import { platforms } from 'src/platforms/dto/constants/templates';

/**
 * Инициализирует базу данных: создает пользователя и шаблонные боты, если они отсутствуют.
 * @param configService - сервис для доступа к конфигурации приложения.
 */
async function initializeDatabase(configService: ConfigService): Promise<void> {
  // Формирование строки подключения к базе данных
  const uri = `mongodb://${configService.get(
    'DB_USERNAME',
  )}:${configService.get('DB_PASSWORD')}@${configService.get(
    'DB_HOST',
  )}:${configService.get('DB_PORT')}/`;
  const client = new MongoClient(uri);

  try {
    // Подключаемся к серверу MongoDB
    await client.connect();

    // Получаем доступ к базе данных 'admin' (обычно используется для административных команд)
    const adminDb = client.db('admin');

    // Запрашиваем информацию о пользователях базы данных
    const result = await adminDb.command({ usersInfo: 1 });

    // Проверяем наличие нашего пользователя в списке пользователей
    const hasUser = result.users.some(
      (user) => user.user === `${configService.get('DB_USERNAME')}`,
    );

    // Если пользователя нет, создаем его
    if (!hasUser) {
      console.log('Creating user...');

      const createUserCommand = {
        createUser: `${configService.get('DB_USERNAME')}`,
        pwd: `${configService.get('DB_PASSWORD')}`,
        roles: [{ role: 'readWrite', db: `${configService.get('DB_NAME')}` }],
      };

      // Отправляем команду для создания пользователя
      await adminDb.command(createUserCommand);

      console.log('User created successfully.');
    } else {
      console.log('User already exists.');
    }

    // Получаем доступ к целевой базе данных
    const currentDb = client.db(`${configService.get('DB_NAME')}`);
    // Получаем коллекцию 'bots'
    const botsCollection = currentDb.collection('bots');

    // Запрашиваем количество шаблонных ботов в коллекции
    const templateBotsCount = await botsCollection.countDocuments({
      type: 'template',
    });

    // Если в коллекции меньше 12 шаблонных ботов или их вообще нет, создаем недостающие
    if (!templateBotsCount) {
      console.log('Creating template bots...');

      // Создаем шаблонные боты
      await botsCollection.insertMany(botTemplates);

      console.log('Template bots created successfully.');
    } else {
      console.log('All template bots already exist.');
    }

    // Получаем коллекцию 'platforms'
    const platformsCollection = currentDb.collection('platforms');

    // Запрашиваем количество платформ в коллекции
    const platformsCount = await platformsCollection.countDocuments();

    // Если в коллекции нет платформ или их количество меньше ожидаемого, создаем недостающие
    if (platformsCount < platforms.length) {
      console.log('Creating platforms...');

      // Получаем список существующих платформ
      const existingPlatforms = await platformsCollection.find().toArray();
      const existingPlatformTitles = existingPlatforms.map((p) => p.title);

      // Фильтруем список платформ, чтобы добавить только те, которых еще нет в базе данных
      const platformsToAdd = platforms.filter(
        (platform) => !existingPlatformTitles.includes(platform.title),
      );

      // Создаем платформы
      await platformsCollection.insertMany(platformsToAdd);

      console.log('Platforms created successfully.');
    } else {
      console.log('All platforms already exist.');
    }
  } catch (error) {
    // Ловим и выводим любые ошибки
    console.error('Error:', error);
  } finally {
    // Закрываем соединение с базой данных
    await client.close();
  }
}

const databaseOptions = (
  configService: ConfigService,
): MongooseModuleOptions => ({
  uri: `mongodb://${configService.get('DB_USERNAME')}:${configService.get(
    'DB_PASSWORD',
  )}@${configService.get('DB_HOST')}:${configService.get(
    'DB_PORT',
  )}/${configService.get(
    'DB_NAME',
  )}?authSource=admin&replicaSet=${configService.get('DB_REPLICATION_SET')}`,
});

export const databaseConfig = (): MongooseModuleAsyncOptions => ({
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    await initializeDatabase(configService);
    return databaseOptions(configService);
  },
});
