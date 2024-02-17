// client.js
// eslint-disable-next-line @typescript-eslint/no-var-requires
const io = require('socket.io-client');
// Добавьте в начало файла
// eslint-disable-next-line @typescript-eslint/no-var-requires
const inquirer = require('inquirer');

const socket = io('http://127.0.0.1:3001', {
  // extraHeaders: {
  //   Authorization: Bearer token-yes,
  // },
  extraHeaders: {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NWQxMDMxN2FmMzQzZDlhZGFlMzM0MzIiLCJqdGkiOiIwMWJkNTc4Y2ZmNjBlYTMwOTZlYzA1ZTU2YzdlOTM1MiIsInR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE3MDgxOTY2MzEsImV4cCI6MTcwODI4MzAzMX0.jUIVH2rAI9sUQz6e2hx-GUOtusLL_gGpDUBkZumze5Q`,
  },
});

// const socket = io('http://127.0.0.1:3001');

let user = {
  name: '',
  id: '',
};

let messageData = {
  participants: [],
  sender: user.name, // Идентификатор отправителя
  message: '', // Текст сообщения
  time: new Date().toISOString(), // Временная метка сообщения
  status: 'sent', // Статус сообщения
  avatar: '',
};

let rooms;
//Слушатели собыий с сервера
// Обработчик успешного подключения
socket.on('connect', async () => {
  console.log('Connected to the server successful');
});

// Подписка на событие 'registered' для получения ответа от сервера после регистрации
socket.on('registered', (data) => {
  console.log('Успешно зарегистрирован пользователь:', data);
  user.name = data.name;
  user.id = data.id;
  setTimeout(() => showMenu(user), 1000); // Передача имени пользователя в showMenu
});

// Подписка на приглашение в чат
socket.on('invite', (inviteData) => {
  console.log('Received invite to dialog:', inviteData);
});

// Подписка на приглашение в чат
socket.on('send_rooms', (inviteData) => {
  console.log(
    'Сработало событие получение чатов у фронитового клиента:',
    inviteData,
  );

  socket.emit('send_rooms', inviteData);
});

// Подписка на получение сообщений в чате
socket.on('message', (msg) => {
  console.log('Новое сообщение:', msg);
});

// Подписка на получение сообщений в чате
socket.on('get-rooms', (msg) => {
  const resrooms = JSON.parse(msg);
  rooms = resrooms.rooms;
});

// Подписка на получение сообщений в чате
socket.on('start-dialog', (msg) => {
  const m = JSON.parse(msg);
  console.log('Dialog started:', `${m.from}:${m.to}`);
});

// Подписка на получение сообщений в чате
socket.on('newChat', async (chatData) => {
  console.log(
    `Сработало событие создание нового чата у фронитового клиента - ${JSON.stringify(
      chatData,
      null,
      2,
    )}`,
  );
  const res = JSON.parse(chatData);
  socket.emit('start-dialog', {
    from: res.sender,
    to: res.participants[1],
  });

  socket.emit('message', res);
});

//Эмитеры событий к серверу
function sendMessageToChat(message) {
  socket.emit('message', message);
}

function startDialog(withUser) {
  socket.emit('start-dialog', { from: user.name, to: withUser });
}

function showMenu(user) {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What do you want to do?',
        choices: ['Send a message', 'Start a dialog'],
      },
    ])
    .then((answers) => {
      switch (answers.action) {
        case 'Send a message':
          if (!rooms || rooms.length === 0) {
            console.log('No rooms available. Please refresh the rooms list.');
            setTimeout(() => showMenu(user), 1000);
            break;
          } else {
            inquirer
              .prompt([
                {
                  type: 'input',
                  name: 'message',
                  message: 'Enter your message:',
                },
                {
                  type: 'list', // Изменено на тип 'list' для выбора из существующих комнат
                  name: 'room',
                  message: 'Choose the room you want to send the message to:',
                  choices: rooms, // Использование списка комнат для выбора
                },
              ])
              .then((answer) => {
                const participantsArray = answer.room.substring(1).split(':');

                const answerObj = {
                  ...messageData,
                  participants: participantsArray, // Добавлено указание комнаты
                  sender: user.name,
                  message: answer.message,
                };
                // Отправка сообщения в указанную комнату или пользователю
                sendMessageToChat(answerObj);
                setTimeout(() => showMenu(user), 1000); // Показать меню снова после отправки сообщения
              });
            break;
          }
        case 'Start a dialog':
          inquirer
            .prompt([
              {
                type: 'input',
                name: 'withUser',
                message: 'Enter the username you want to start a dialog with:',
              },
            ])
            .then((answer) => {
              startDialog(answer.withUser);
              setTimeout(() => showMenu(user), 1000); // Показать меню снова после инициации диалога
            });
          break;
      }
    });
}
