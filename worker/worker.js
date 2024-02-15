//worker
import { createClient } from 'redis'; // Импорт клиента Redis для работы с Redis сервером.
import { Emitter } from '@socket.io/redis-emitter'; // Импорт Emitter для работы с Redis и Socket.IO.
import mongoose, { Schema, Types } from 'mongoose'; // Импорт Mongoose для работы с MongoDB.
import dotenv from 'dotenv';
dotenv.config({ path: '.env.worker' });

//worker.js
// Определение схемы и модели для сообщений в MongoDB.
const Messages = mongoose.model(
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

const Chats = mongoose.model(
  'Chat',
  new Schema(
    {
      chatId: { type: String, required: true, unique: true }, // Уникальный идентификатор чата
      messages: {
        type: [
          { type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: [] },
        ],
      },
      profile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
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

async function pushToArray(arr, el) {
  return arr.push(el);
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
  subClient.subscribe('newChat', async (chatData) => {
    console.log(`Сработал подписчик на newChat в воркере - ` + chatData);
    const { participants } = JSON.parse(chatData); // Разбор JSON строки с задачей.

    try {
      const newChat = new Chats({
        chatId: `/${participants[0]}:${participants[1]}`,
        profile: new mongoose.Types.ObjectId(participants[1]),
      }); // Создание экземпляра сообщения для MongoDB.

      await newChat.save(); // Сохранение сообщения в MongoDB.
      // Добавили в Redis комнату
      await pubClient.set(
        `chat:${newChat.chatId}`,
        JSON.stringify({ newChat }),
      );
    } catch (e) {
      if (e.code === 11000) {
        console.log('Отправили пользователя в свою комнату с этмтом message');
        emitter.to(`/user/${participants[1]}`).emit('message', chatData); // Отправка уведомления пользователю.
        return;
      }
      console.error(`Ошибка в подписчике newChat - ${e.message}`);
    }
    emitter.to(`/user/${participants[1]}`).emit('newChat', chatData); // Отправка уведомления пользователю.
  });

  // Подписка на канал 'message' и обработка сообщений.
  subClient.subscribe('message', async (messageData) => {
    const objMessage = JSON.parse(messageData);

    if (!objMessage.chatId) {
      objMessage.chatId = `/${objMessage.participants[0]}:${objMessage.participants[1]}`;
    }

    console.log(`Сработало событие на воркере message - ${messageData}`);

    const chat = await Chats.findOne({
      profile: new mongoose.Types.ObjectId(objMessage.participants[1]),
    });

    if (!chat) {
      console.log(`no chat item.`); // Логирование в случае ошибки.
      return;
    }

    try {
      const message = new Messages(objMessage); // Создание экземпляра сообщения для MongoDB.

      await message.save(); // Сохранение сообщения в MongoDB.

      await pushToArray(chat.messages, message._id);
      await chat.save();
      console.log(`save message (${message._id}) to history`);
    } catch (err) {
      console.log(err.message); // Логирование в случае ошибки.
    }

    // Получение последних 30 сообщений из MongoDB.
    const lastMessages = await Messages.find({})
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

  subClient.subscribe('get_rooms', async (data) => {
    const { userId } = JSON.parse(data); // Разбор JSON строки с задачей.

    const chats = await Chats.find({
      profile: new mongoose.Types.ObjectId(userId),
    });
  });
});
