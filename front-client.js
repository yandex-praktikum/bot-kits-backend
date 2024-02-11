// client.js
// eslint-disable-next-line @typescript-eslint/no-var-requires
const io = require('socket.io-client');
// Добавьте в начало файла
// eslint-disable-next-line @typescript-eslint/no-var-requires
const inquirer = require('inquirer');

// Подключение к серверу WebSocket
const socket = io('http://localhost:3001');

let user = {
  name: '',
  id: '',
};

let rooms;
//Слушатели собыий с сервера
// Обработчик успешного подключения
socket.on('connect', async () => {
  console.log('Connected to the server.');
  // Запрос имени пользователя перед регистрацией
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Введите ваше имя:',
    },
  ]);

  user.name = answers.name;
  socket.emit('register', { name: user.name });
});

// Подписка на событие 'registered' для получения ответа от сервера после регистрации
socket.on('registered', (data) => {
  console.log('Успешно зарегистрирован пользователь:', data);
  user = data;
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
socket.on('emitNewChat', (msg) => {
  console.log('Эмитим новый чат через эмитер воркера:', msg);
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
socket.on('newChat', (msg) => {
  console.log(
    `Сработало событие создание нового чата у фронитового клиента - ${JSON.stringify(
      msg,
      null,
      2,
    )}`,
  );
  socket.emit('start-dialog', {
    from: msg.from,
    to: msg.to,
    message: msg.message,
  });
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
