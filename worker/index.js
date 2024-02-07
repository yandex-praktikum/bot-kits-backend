// Импорт необходимых библиотек.
import { createClient } from 'redis'; // Импорт клиента Redis для работы с Redis сервером.
import { Emitter } from '@socket.io/redis-emitter'; // Импорт Emitter для работы с Redis и Socket.IO.
import mongoose, { Schema } from 'mongoose'; // Импорт Mongoose для работы с MongoDB.
import dotenv from 'dotenv';

dotenv.config();

// Определение схемы и модели для сообщений в MongoDB.
const Message = mongoose.model(
  'Message',
  new Schema(
    {
      user: String, // Поле для имени пользователя.
      message: String, // Поле для текста сообщения.
    },
    {
      timestamps: true, // Включение автоматических временных меток (createdAt, updatedAt).
    },
  ),
);

// Создание клиентов Redis для публикации (pubClient), подписки (subClient) и кэширования (cacheClient).
const pubClient = createClient({
  url: `${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});
const subClient = pubClient.duplicate(); // Дублирование pubClient для подписки.
const cacheClient = pubClient.duplicate(); // Дублирование для кэширования.

// Подключение к Redis и MongoDB.
Promise.all([
  pubClient.connect(),
  subClient.connect(),
  cacheClient.connect(),
  mongoose.connect(
    `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin&replicaSet=${process.env.DB_REPLICATION_SET}`,
  ), // Подключение к MongoDB.
]).then(() => {
  const emitter = new Emitter(pubClient); // Создание Emitter для публикации событий через Redis.

  // Подписка на канал 'task' и обработка полученных задач.
  subClient.subscribe('task', (task) => {
    const { user, payload } = JSON.parse(task); // Разбор JSON строки с задачей.
    console.log(`worker: `, payload);
    setTimeout(() => {
      emitter.to(`/user/${user}`).emit('notify', `task "${payload}" ready!`); // Отправка уведомления пользователю.
    }, 3000); // Имитация задержки выполнения задачи.
  });

  // Подписка на канал 'message' и обработка сообщений.
  subClient.subscribe('message', async (task) => {
    try {
      const { user, message } = JSON.parse(task); // Разбор JSON строки с сообщением.
      const item = new Message({ user, message }); // Создание экземпляра сообщения для MongoDB.

      await item.save(); // Сохранение сообщения в MongoDB.
      console.log(`save message (${item._id}) to history`);
    } catch (err) {
      console.log(`no item saved.`); // Логирование в случае ошибки.
    }

    // Получение последних 30 сообщений из MongoDB.
    const lastMessages = await Message.find({})
      .limit(30)
      .sort('createdAt')
      .exec();

    // Кэширование истории сообщений в Redis.
    await cacheClient.set('history', JSON.stringify(lastMessages));
    console.log('saved history cache');
  });
});
