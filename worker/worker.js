//worker
import { createClient } from 'redis'; // Импорт клиента Redis для работы с Redis сервером.
import { Emitter } from '@socket.io/redis-emitter'; // Импорт Emitter для работы с Redis и Socket.IO.
import mongoose, { Schema } from 'mongoose'; // Импорт Mongoose для работы с MongoDB.
import dotenv from 'dotenv';
dotenv.config({ path: '.env.worker' });

//worker.js
// Определение схемы и модели для сообщений в MongoDB.
const Message = mongoose.model(
  'Message',
  new Schema(
    {
      chatId: { type: String, required: true }, // Уникальный идентификатор чата
      participants: {
        type: [{ type: String, required: true }],
        validate: [arrayLimit, '{PATH} exceeds the limit of 2'], // Кастомная валидация на размер массива
      },
      sender: { type: String, required: true }, // Идентификатор отправителя
      message: { type: String, required: true }, // Текст сообщения
      time: { type: Date, default: Date.now }, // Временная метка сообщения
      status: {
        type: String,
        enum: ['sent', 'delivered', 'read'],
        default: 'sent',
      }, // Статус сообщения
      seen: { type: Date, default: Date.now },
      online: { type: Boolean, default: false },
      avatar: { type: String, default: '' },
    },
    {
      timestamps: true, // Включение временных меток createdAt и updatedAt
    },
  ),
);

// Функция для проверки, что массив содержит ровно 2 элемента
function arrayLimit(val) {
  return val.length === 2;
}

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
  subClient.subscribe('newChat', (chatData) => {
    console.log(`Сработал подписчик на newChat в воркере - ` + chatData);
    const { participants } = JSON.parse(chatData); // Разбор JSON строки с задачей.
    emitter.to(`/user/${participants[1]}`).emit('newChat', chatData); // Отправка уведомления пользователю.
  });

  // Подписка на канал 'message' и обработка сообщений.
  subClient.subscribe('message', async (messageData) => {
    const objMessage = JSON.parse(messageData);
    console.log(objMessage);
    try {
      const item = new Message(objMessage); // Создание экземпляра сообщения для MongoDB.

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

  // Подписка на канал 'task' и обработка полученных задач.
  subClient.subscribe('task', (task) => {
    const { user, payload } = JSON.parse(task); // Разбор JSON строки с задачей.
    console.log(`worker: `, payload);

    setTimeout(() => {
      emitter.to(`/user/${user}`).emit('notify', `task "${payload}" ready!`); // Отправка уведомления пользователю.
    }, 3000); // Имитация задержки выполнения задачи.
  });
});
