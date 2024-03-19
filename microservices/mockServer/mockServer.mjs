import express from 'express';
import http from 'http';
import { Server as socketIO } from 'socket.io';
import cors from 'cors';
import { createClient } from 'redis';
import { Emitter } from '@socket.io/redis-emitter';
import dotenv from 'dotenv';

dotenv.config(); //-- Загрузка переменных среды из файла .env --//

const app = express();
const server = http.createServer(app);
const io = new socketIO(server, {
  cors: {
    origin: '*', //-- Разрешить все источники --//
    methods: ['GET', 'POST'], //-- Разрешить только методы GET и POST --//
  },
});

const STATUS_BOT = ['updating', 'started', 'error'];

const PORT = process.env.MOCK_SERVER_PORT;

//-- Создание клиентов Redis для публикации (pubClient), подписки (subClient) и кэширования (cacheClient) --//
const pubClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

const subClient = pubClient.duplicate(); //-- Дублирование pubClient для подписки --//
const cacheClient = pubClient.duplicate(); //-- Дублирование для кэширования --//

app.use(cors('*'));

app.use(express.json());

//-- Ручка для проверки работоспособности сервера --//
app.get('', (req, res) => {
  res.json({ success: 'Все хорошо, я в порядке' });
});

//-- Ручка для получения пользователей бота --//
app.get('/bot/users', (req, res) => {
  const botUsers = ['user1', 'user2', 'user3'];
  res.json({ users: botUsers });
});

//-- Ручка для получения статуса запуска бота --//
app.post('/bot/status', (req, res) => {
  const randIndex = Math.floor(Math.random() * STATUS_BOT.length);

  const serverStatus = {
    status: STATUS_BOT[randIndex],
  };
  res.json(serverStatus);
});

//-- Логика обработки подключений клиента мокоовго чата --//
io.on('connection', (socket) => {
  console.log('Chat connected');

  socket.on('disconnect', () => {
    console.log('Chat disconnected');
  });

  socket.on('mockChatHistory', async (userId) => {
    //-- Используем scan для поиска всех ключей, связанных с userId, чтобы избежать блокировки сервера при большом количестве ключей --//
    let cursor = 0;
    let keys = [];

    do {
      //-- Ищем ключи, которые содержат userId в части chatId --//
      const reply = await cacheClient.scan(
        cursor,
        'MATCH',
        `history/*${userId}*`,
      );
      cursor = reply.cursor;

      keys = reply.keys;
    } while (cursor !== 0);

    //-- Уникальные ключи для избежания дубликатов --//
    keys = [...new Set(keys)];

    let allChatsHistory = [];

    for (let key of keys) {
      const history = await cacheClient.get(key);
      //-- Проверяем, существует ли история для данного ключа --//
      if (history) {
        allChatsHistory.push(JSON.parse(history));
      }
    }

    //-- Отправляем историю всех чатов обратно клиенту --//
    socket.emit('allChatsHistory', allChatsHistory);
    console.log('Эмит allChatsHistory на моковом сервере');
  });

  //-- Обработка полученного сообщения и его рассылка --//
  socket.on('mockChatMessage', async (msg) => {
    console.log(
      `user: ${msg.sender}, message: ${msg.message}, toUser: ${msg.participants[1]}`,
    ); //-- Логируем сообщение на сервере --//

    //-- Предположим, что chatId - это уникальный идентификатор чата --//
    const chatExists = await cacheClient.exists(
      `history${`//${msg.participants[0]}:${msg.participants[1]}`}`,
    );

    //-- Если чат существует публикуем сообщение в Redis с последующей отправкой в чаты --//
    if (chatExists) {
      const messageWithChatId = {
        ...msg,
        chatId: `/${msg.participants[0]}:${msg.participants[1]}`,
      };
      console.log('Отправляем пользователю сообщение в существующую комнату');
      pubClient.publish('message', JSON.stringify(messageWithChatId));
    }
    //-- Если чат не существует публикуем событие на создание нового чата с последующей отправкой сообщения в новый чат --//
    else {
      console.log(
        'Отправляем первое сообщение для создания нового чата на root frontend',
      );
      pubClient.publish('newChat', JSON.stringify(msg));
    }
  });
});

server.listen(PORT, () => {
  console.log(`Mock Server is running on http://localhost:${PORT}`);
});

//-- Подключение к Redis --//
Promise.all([
  pubClient.connect(),
  subClient.connect(),
  cacheClient.connect(),
]).then(() => {
  const emitter = new Emitter(pubClient); //-- Создание Emitter для публикации событий по SocketIO через Redis --//

  //-- Подписка на канал 'task' и обработка полученных задач --//
  subClient.subscribe('task', (task) => {
    const { user, payload } = JSON.parse(task); //-- Разбор JSON строки с задачей --//
    console.log(`worker: `, payload);
    setTimeout(() => {
      emitter.to(`/user/${user}`).emit('notify', `task "${payload}" ready!`); //-- Отправка уведомления пользователю --//
    }, 3000); //-- Имитация задержки выполнения задачи --//
  });

  //-- Подписка на канал 'message' и обработка сообщений --//
  subClient.subscribe('message', async (message) => {
    const msg = JSON.parse(message); //-- Разбор JSON строки с сообщением --//
    console.log(`mock server get message - ${JSON.stringify(msg, null, 2)}`);
    io.emit('messageMockClient', msg); //-- Трансляция сообщения всем подключенным клиентам --//
  });

  //-- Подписка на канал 'register' и обработка регистраций --//
  subClient.subscribe('register', (user) => {
    const userObj = JSON.parse(user);
    console.log(`mock server register: ${JSON.stringify(userObj, null, 2)}`);
    setTimeout(() => {
      io.emit('register', user); //-- Отправка уведомления пользователю --//
    }, 3000); //-- Имитация задержки выполнения задачи --//
  });
});
