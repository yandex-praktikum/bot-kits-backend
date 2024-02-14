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
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NWNkMjQwMWVhMWFlNmQ5ZTUyMDY1ZjAiLCJqdGkiOiI0YWY5ZjdmYTljZTA1ZDQ1NzhkZjI4OWExM2RlNGM5YSIsInR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE3MDc5NDI5MTMsImV4cCI6MTcwODAyOTMxM30.ScUslLD_3bPvAlJ7UyuqU32Znry7p3lStzH9lTCponw`,
  },
});

// const socket = io('http://127.0.0.1:3001');

let user = {
  name: '',
  id: '',
};

let message = {
  avatar: '',
  user: 'Вячеслав Баумтрок',
  message: 'Инициализация дилога',
  time: '16 мин назад',
  online: false,
  seen: '14:05',
  status: 'read',
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
  // console.log(
  //   `Сработало событие создание нового чата у фронитового клиента - ${JSON.stringify(
  //     chatData,
  //     null,
  //     2,
  //   )}`,
  // );
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
                const answerObj = {
                  to: answer.room, // Добавлено указание комнаты
                  from: user.name,
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
