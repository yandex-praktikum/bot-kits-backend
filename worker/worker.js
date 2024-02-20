import { createClient } from 'redis';
import { Emitter } from '@socket.io/redis-emitter';
import mongoose, { Schema } from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.worker' });

//--Cхема для сообщений в MongoDB--//
const Messages = mongoose.model(
  'Message',
  new Schema(
    {
      chatId: { type: String, required: true },
      participants: {
        //--Массив участников чата, должен содержать ровно 2 элемента id отправителя и id получателя--//
        type: [{ type: String, required: true }],
        validate: [arrayLimit, '{PATH} exceeds the limit of 2'],
      },
      sender: { type: String, required: true },
      message: { type: String, required: true },
      time: { type: Date, default: Date.now },
      status: {
        type: String,
        enum: ['sent', 'delivered', 'read'],
        default: 'sent',
      },
      seen: { type: Date, default: Date.now },
      online: { type: Boolean, default: false },
      avatar: { type: String, default: '' },
    },
    {
      timestamps: true,
    },
  ),
);

//--Cхема для чатов в MongoDB--//
const Chats = mongoose.model(
  'Chat',
  new Schema(
    {
      chatId: { type: String, required: true, unique: true },
      messages: {
        type: [
          { type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: [] },
        ],
      },
      profile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
    },
    {
      timestamps: true,
    },
  ),
);

//--Проверки размера массива участников--//
function arrayLimit(val) {
  return val.length === 2; // Условие, что в массиве ровно 2 элемента
}

//--Асинхронное добавление элемента в массив--//
async function pushToArray(arr, el) {
  return arr.push(el);
}

//--Создание клиентов Redis--//
const pubClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

const subClient = pubClient.duplicate();
const cacheClient = pubClient.duplicate();

//--Подключение к Redis и MongoDB--//
Promise.all([
  pubClient.connect(),
  subClient.connect(),
  cacheClient.connect(),
  mongoose.connect(
    `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin&replicaSet=${process.env.DB_REPLICATION_SET}`,
  ),
])
  .then(() => {
    const emitter = new Emitter(pubClient); //--Emitter для публикации событий через Redis.--//

    //--Подписка на событие создания нового чата. При получении события, выполняется асинхронная функция.--//
    subClient.subscribe('newChat', async (chatData) => {
      //--Парсинг полученных данных о чате из формата JSON--//
      const { participants } = JSON.parse(chatData);

      try {
        //--Создание нового документа чата в базе данных MongoDB--//
        const newChat = new Chats({
          chatId: `/${participants[0]}:${participants[1]}`,
          profile: new mongoose.Types.ObjectId(participants[1]),
        });

        //--Попытка сохранить новый чат в базе данных--//
        await newChat.save();
      } catch (e) {
        if (e.code === 11000) {
          //--Если чат уже существует, тогда отправляем сообщение в существующую комнату--//
          emitter.to(`/user/${participants[1]}`).emit('message', chatData);
          return;
        }
        //--Обработка остальных ошибок--//
        console.error(`Ошибка в подписчике newChat - ${e.message}`);
      }
      //--Если же чата не существует тогда присоединяем пользователя к комнате с новым чатм--//
      emitter.to(`/user/${participants[1]}`).emit('newChat', chatData);
    });

    //--Подписка на событие отправки сообщения. При получении события выполняется асинхронная функция--//
    subClient.subscribe('message', async (messageData) => {
      const objMessage = JSON.parse(messageData); // Парсинг данных сообщения из JSON.

      if (!objMessage.chatId) {
        //--Если в сообщении не указан идентификатор чата, формируем его--//
        objMessage.chatId = `/${objMessage.participants[0]}:${objMessage.participants[1]}`;
      }

      //--Поиск чата по идентификатору профиля получателя сообщения--//
      const chat = await Chats.findOne({
        profile: new mongoose.Types.ObjectId(`${objMessage.participants[1]}`),
      });

      //--TODO: что делать если чат не найден?--//
      if (!chat) {
        console.log(`no chat item.`);
        return;
      }

      try {
        //--Создание экземпляра сообщения для сохранения в MongoDB--//
        const message = new Messages(objMessage);

        //--Сохранение сообщения и добавление его идентификатора в массив сообщений чата--//
        await message.save();
        await pushToArray(chat.messages, message._id);
        await chat.save();

        //--Отправка сообщения пользователю на клиент--//
        emitter
          .to(`/user/${objMessage.participants[1]}`)
          .emit('message', messageData);
      } catch (err) {
        //--TODO: нужно ли пытаться ещё раз пробовать сохранять сообщение в чате?--//
        console.log(err.message);
      }

      //--Кэширование обновленной истории чата пользователя в Redis для быстрого доступа--//
      await cacheClient.set(
        `history/${chat.chatId}`,
        JSON.stringify(await chat.populate('messages')),
      );
    });

    //--Подписка на событие получения задач--//
    subClient.subscribe('task', (task) => {
      const { user, payload } = JSON.parse(task);

      //--Имитация выполнения задачи с задержкой--//
      setTimeout(() => {
        //--TODO: доработать отправку уведомлений--//
        emitter.to(`/user/${user}`).emit('notify', `task "${payload}" ready!`);
      }, 3000);
    });

    //--Подписка на событие запроса списка комнат (чатов) пользователя--//
    subClient.subscribe('get_rooms', async (userID) => {
      const { userId } = JSON.parse(userID);

      //--Поиск чатов, в которых участвует пользователь--//
      const chats = await Chats.find({
        profile: new mongoose.Types.ObjectId(userId),
      });

      //--Формирование списка идентификаторов чатов пользователя--//
      const rooms = chats.map((room) => room.chatId);

      //--Отправка списка комнат пользователю--//
      emitter.to(`/user/${userId}`).emit('send_rooms', rooms);
    });

    //--Подписка на событие регистрации пользователя и обработка его истории чатов--//
    subClient.subscribe('register', async (user) => {
      const userObj = JSON.parse(user);

      //--Поиск чатов пользователя и предварительная загрузка сообщений для каждого чата--//
      const chats = await Chats.find({
        profile: new mongoose.Types.ObjectId(userObj._id),
      }).populate('messages');

      //--Если у пользователя есть история чатов, кэшируем её в Redis по комнатам--//
      if (chats.length > 0) {
        //--Отправляем историю конкретного пользователя клиенту--//
        emitter.to(`/user/${userObj._id}`).emit('allChatsHistory', chats);
        //--Складываем в кеш всю историию предварительно раскидывая её по комнатам для удобства разбора на моковом сервере--//
        chats.forEach(async (chat) => {
          await cacheClient.set(`history/${chat.chatId}`, JSON.stringify(chat));
        });
      } else {
        console.log(`У пользователя - ${userObj.username}, пока нет истории`);
        return;
      }
    });
  })
  .catch((e) => {
    console.error(`${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);
    console.error(e);
  });
