// mockServer.mjs
import express from 'express';
import http from 'http';
import { Server as socketIO } from 'socket.io';
import cors from 'cors';
import { createClient } from 'redis'; // Импорт клиента Redis для работы с Redis сервером.
import { Emitter } from '@socket.io/redis-emitter'; // Импорт Emitter для работы с Redis и Socket.IO.
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new socketIO(server, {
  cors: {
    origin: '*', // Разрешить все источники
    methods: ['GET', 'POST'], // Разрешить только методы GET и POST
  },
}); // Используйте new для создания экземпляра Server

const PORT = process.env.MOCK_SERVER_PORT;

// Создание клиентов Redis для публикации (pubClient), подписки (subClient) и кэширования (cacheClient).
const pubClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

const subClient = pubClient.duplicate(); // Дублирование pubClient для подписки.
const cacheClient = pubClient.duplicate(); // Дублирование для кэширования.

app.use(cors('*'));

app.use(express.json());

app.get('', (req, res) => {
  res.json({ success: 'Все хорошо, я в порядке' });
});

// Ручка для получения пользователей бота
app.get('/bot/users', (req, res) => {
  // Здесь вы можете обработать запрос и вернуть пользователей бота
  // Например, отправить массив пользователей в формате JSON
  //TODO: отправлять рандомный список пользователей:
  // const botUsers = {
  //   id: string ,
  //   name: string,
  //   email: string,
  //   phone: string,
  // };
  const botUsers = ['user1', 'user2', 'user3'];
  res.json({ users: botUsers });
});

// Ручка для получения статуса мокового сервера
app.get('/mock-server/status', (req, res) => {
  // Здесь вы можете проверить статус сервера и вернуть его в ответе
  // Например, вернуть объект с полем "status"
  //TODO: отправлять рандомно статус :
  // const iconMap = {
  //   started: { icon: 'syncDone' as const, label: 'запущен' },
  //   error: { icon: 'slash' as const, label: 'ошибка' },
  //   updating: { icon: 'syncUpdate' as const, label: 'обновляется' },
  //   editing: { icon: 'dropdownEdit' as const, label: 'редактируется' },
  // };

  const serverStatus = {
    status: 'running', // Замените на актуальный статус вашего сервера
  };
  res.json(serverStatus);
});

io.on('connection', (socket) => {
  console.log('Chat connected');

  socket.on('disconnect', () => {
    console.log('Chat disconnected');
  });

  socket.on('mockChatHistory', async (userId) => {
    // Используем scan для поиска всех ключей, связанных с userId, чтобы избежать блокировки сервера при большом количестве ключей
    let cursor = 0;
    let keys = [];

    do {
      // Ищем ключи, которые содержат userId в части chatId
      const reply = await cacheClient.scan(
        cursor,
        'MATCH',
        `history/*${userId}*`,
      );
      cursor = reply.cursor;

      keys = reply.keys;
    } while (cursor !== 0);

    // Уникальные ключи для избежания дубликатов
    keys = [...new Set(keys)];

    let allChatsHistory = [];

    for (let key of keys) {
      const history = await cacheClient.get(key);
      // Проверяем, существует ли история для данного ключа
      if (history) {
        allChatsHistory.push(JSON.parse(history));
      }
    }

    //Отправляем историю всех чатов обратно клиенту
    socket.emit('allChatsHistory', allChatsHistory);
    console.log('Эмит allChatsHistory на моковом сервере');
  });

  // Обработка полученного сообщения и его рассылка
  socket.on('mockChatMessage', async (msg) => {
    console.log(
      `user: ${msg.sender}, message: ${msg.message}, toUser: ${msg.participants[1]}`,
    ); // Логируем сообщение на сервере

    // Предположим, что chatId - это уникальный идентификатор чата
    const chatExists = await cacheClient.exists(
      `history${`//${msg.participants[0]}:${msg.participants[1]}`}`,
    );

    console.log(
      `Такой чат  ${`chat:${`/${msg.participants[0]}:${msg.participants[1]}`}`}, есть? - ${chatExists}`,
    );

    if (chatExists) {
      const messageWithChatId = {
        ...msg,
        chatId: `/${msg.participants[0]}:${msg.participants[1]}`,
      };
      console.log('Отправляем пользователю сообщение в существующую комнату');
      pubClient.publish('message', JSON.stringify(messageWithChatId));
    } else {
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

//Подключение к Redis и MongoDB.
Promise.all([
  pubClient.connect(),
  subClient.connect(),
  cacheClient.connect(),
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

  //Подписка на канал 'message' и обработка сообщений.
  subClient.subscribe('message', async (message) => {
    const msg = JSON.parse(message); // Разбор JSON строки с сообщением.
    console.log(`mock server get message - ${JSON.stringify(msg, null, 2)}`);
    io.emit('messageMockClient', msg); // Трансляция сообщения всем подключенным клиентам.
  });

  // Подписка на канал 'task' и обработка полученных задач.
  subClient.subscribe('register', (user) => {
    const userObj = JSON.parse(user);
    console.log(`mock server register: ${JSON.stringify(userObj, null, 2)}`);
    setTimeout(() => {
      io.emit('register', user); // Отправка уведомления пользователю.
    }, 3000); // Имитация задержки выполнения задачи.
  });
});
