# Описание проекта BotKits backend-часть

Данный проект является полноценным веб-сервисом, состоящий из back- **и front- **частей для удобного создания \*\*пользователями собственных ботов.

__[Notion](https://www.notion.so/BotKits-14-web-195fad87a50d4ad58a4e5d6fb5ea4e25) проекта и его функциональности__
__Ссылка на репозиторий проекта BotKits [frontend-часть]({https://github.com/MrStnr21/botkits-14-frontend})__
***
## Запуск проекта
### Предварительная настройка

Для запуска необходимы Node.js старше 16.x, MongoDB не страше 5.0 и не младше 4.4, OS UBUNTU-20.04. 
Для запуска в Docker, убедитесь, что у вас есть два .env файла:

- .env (или .env.dev для разработки)
- .env.docker (для запуска проекта в docker в dev режиме)

Примеры значений переменных можно увидеть в .env.example.

```yaml
# Для работы приложения
NODE_ENV=your_env_mode                         # Режим работы приложения (например, prod, dev и т. д.)
APP_PORT=your_app_port                         # Порт, на котором будет слушать ваше nestjs-приложение.
JWT_SECRET=your_jwt_secret                     # Секретный ключ для JWT (JSON Web Tokens).
JWT_EXPIRES=your_jwt_lifetime                  # Время жизни JWT. (например 1d)
ALLOW_URL=your_allowed_url                     # Разрешенный URL политикой CORS
THROTTLE_TIME_WINDOW_SECONDS=your_time_window  # Окно времени для управления частотой запросов (например 1).
THROTTLE_REQUESTS_LIMIT=your_requests_limit    # Лимит запросов в окне времени для управления частотой (например 1000).

# Для dockercompose
PORT_CONTAINER=your_container_port             # Порт внутри Docker-контейнера, на который будет проброшен APP_PORT.
MONGO_PORT=your_mongo_port                     # Порт MongoDB внутри Docker-контейнера.

# Для базы данных
DB_PORT=your_db_port                           # Порт для вашей базы данных MongoDB.
DB_USERNAME=your_db_username                   # Имя пользователя для вашей базы данных.
DB_PASSWORD=your_db_password                   # Пароль для вашей базы данных.
DB_HOST=your_db_host                           # Хост базы данных. Когда используется контейнер, он обычно называется именем службы в docker-compose, например 'mongo' или 'db'.
DB_NAME=your_db_name                           # Название вашей базы данных в MongoDB.
DB_REPLICATION_SET=your_replication_set        # Набор репликаций для MongoDB (например rs01).
MONGO_INITDB_ROOT_USERNAME=your_db_username    # Для запуска через контейнер в dev режиме должно совпадать с DB_USERNAME
MONGO_INITDB_ROOT_PASSWORD=your_db_password    # Для запуска через контейнер в dev режиме должно совпадать с DB_PASSWORD

# === Yandex OAuth ===
YANDEX_APP_ID=""                               # Идентификатор приложения для Yandex OAuth.
YANDEX_APP_SECRET=""                           # Секретный ключ приложения для Yandex OAuth.
YANDEX_TOKEN_URL=""                            # URL для получения токена для Yandex OAuth.
YANDEX_USER_INFO_URL=""                        # URL для получения информации пользователя для Yandex OAuth.

# === Google OAuth ===
GOOGLE_APP_ID=""                               # Идентификатор клиента для Google OAuth.
GOOGLE_APP_SECRET=""                           # Секретный ключ клиента для Google OAuth.
GOOGLE_CALLBACK_URL=""                         # URL обратного вызова для Google OAuth.
GOOGLE_RES_REDIRECT_URL=""                     # URL перенаправления ответа сервера для Google OAuth.

# === VK OAuth ===
VK_APP_ID=""                                   # Идентификатор клиента для VK OAuth.
VK_APP_SECRET=""                               # Секретный ключ клиента для VK OAuth.
VK_CALLBACK_URL=""                             # URL обратного вызова для VK OAuth.
VK_RES_REDIRECT_URL=""                         # URL перенаправления ответа сервера для VK OAuth.

# === Mail.Ru OAuth ===
MAILRU_APP_ID=""                               # Идентификатор приложения для Mail.Ru OAuth.
MAILRU_APP_SECRET=""                           # Секретный ключ приложения для Mail.Ru OAuth.
MAILRU_TOKEN_URL=""                            # URL для получения токена для Mail.Ru OAuth.
MAILRU_USER_INFO_URL=""                        # URL для получения информации пользователя для Mail.Ru OAuth.
MAILRU_REDIRECT_URL=""                         # URL перенаправления для Mail.Ru OAuth.

# === Telegram OAuth & Bot ===
TELEGRAM_BOT_TOKEN=""                          # Токен для Telegram Bot.
TELEGRAM_APP_ID=""                             # Идентификатор приложения для Telegram OAuth.
TELEGRAM_APP_HASH=""                           # Хэш приложения для Telegram OAuth.
```
***
##Запуск в режиме разработки
__Через NPM__ - это запустит ваш проект в attached режиме. Это значит, что вы будете видеть стандартный вывод (STDOUT) и стандартный вывод ошибок (STDERR) контейнера в вашем терминале в реальном времени.
```
npm run start:dev:docker
```
__Через Docker Compose__
```
docker-compose -f docker-compose-dev.yml up --env-file .env.dev --env-file .env.db -d
```
Это запустит ваш проект в фоновом режиме.

В обоих случаях будут запущены контейнеры с бэкендом и базой данных.

__Локально через NPM__ - позволит вести видеть изменения в реальном времени и работать с локальной БД
```
npm run start:dev
```
##Запуск в режиме production
```
docker-compose -f docker-compose.yml --env-file .env up -d
```
***
## Для того чтобы увидеть документацию Swagger
```
<url>:<порт на котором запущен сервер>/api/docs 
#Пример http://127.0.0.1:3001/api/docs
```
***
## Команда backend части проекта 14 когорты

- [Семен Чехов](https://github.com/JustSimon01)
- [Екатерина Осипова](https://github.com/kur0yuki)
- [Анастасия Разживина](https://github.com/Virshinia)
- [Антон Помазков](https://github.com/pomazkovanton)
- [Анна Силина](https://github.com/annasilina)
- [Иван Антипенко](https://github.com/Ivan-Antipenko)
- [Наталья Беликова](https://github.com/pblHbKa)
- [Евгений Русаков](https://github.com/Shoomec74)
***
## MongoDb работает с транзакциями, поэтому необходимо установить набор реплик
__Шаг 1:__ Найдите файл конфигурации MongoDB на вашем устройстве. Обычно он называется __mongod.conf.__

__Шаг 2:__ Добавьте следующие строки в ваш файл конфигурации:
```
replication:
  replSetName: "rs0"  # имя набора реплик
```
__Шаг 3:__ Сохраните и закройте файл конфигурации.

__Шаг 4:__ Перезапустите MongoDB с обновленной конфигурацией. В зависимости от вашей операционной системы выполните одну из следующих команд в терминале:
- Windows:
```
mongod --config "путь\до\вашего\mongod.conf" --install
```
- MacOS:
```
brew services start mongodb-community --config=/путь/до/вашего/mongod.conf
```
__Шаг 5:__ Откройте MongoDB shell, выполнив следующую команду в терминале:
```
mongo
```
__Шаг 6:__ После успешного подключения инициализируйте репликацию, введя следующую команду в MongoDB shell:
```
rs.initiate()
```
__Шаг 7:__ Проверьте статус репликации, введя следующую команду в MongoDB shell:
```
rs.status()
```
__Шаг 8:__ В файле с переменными среды (env) вашего проекта добавьте следующую строку:
```
DB_REPLICATION_SET=name replication set
```
***
## API сервиса

### Auth. Методы работы с авторизацией пользователей.

**post /signin**

- назначение: вход в систему
- параметры:

```yaml
{ 'email': 'test@mail.ru', 'password': '123' }
```

- успешный ответ:

```yaml
{
  '_id': '650b396dd4201e5ca499f3b3',
  'username': 'test',
  'phone': '+79999999999',
  'avatar': 'https://i.pravatar.cc/300',
  'balance': 0,
  'accounts':
    [
      {
        '_id': '650b396ed4201e5ca499f3b5',
        'type': 'local',
        'role': 'user',
        'credentials':
          {
            'email': 'test@mail.ru',
            'accessToken': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
            'refreshToken': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
          },
        'profile': '650b396dd4201e5ca499f3b3',
      },
    ],
}
```

- ответ с ошибкой:

```yaml
{
  'message': 'Неверное имя пользователя или пароль',
  'error': 'Unauthorized',
  'statusCode': 401,
}
```

**post /signup**

- назначение: регистрация пользователя
- параметры:

```yaml
{
  'password': '123',
  'email': 'test@mail.ru',
  'phone': '+79999999999',
  'username': 'test',
}
```

- успешный ответ:

```yaml
{
  '_id': '650b396dd4201e5ca499f3b3',
  'username': 'test',
  'phone': '+79999999999',
  'avatar': 'https://i.pravatar.cc/300',
  'balance': 0,
  'accounts':
    [
      {
        '_id': '650b396ed4201e5ca499f3b5',
        'type': 'local',
        'role': 'user',
        'credentials':
          {
            'email': 'test@mail.ru',
            'accessToken': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
            'refreshToken': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
          },
        'profile': '650b396dd4201e5ca499f3b3',
      },
    ],
}
```

- ответ с ошибкой:

```yaml
{ 'message': 'Аккаунт уже существует', 'error': 'Conflict', 'statusCode': 409 }
```

**post /refresh-token**

- назначение: обновления токена авторизации
- параметры:

```yaml
{ 'refreshToken': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' }
```

- успешный ответ:

```yaml
{
  'accessToken': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  'refreshToken': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
}
```

- ответ с ошибкой:

```yaml
{
  'message': 'Невалидный refreshToken',
  'error': 'Unauthorized',
  'statusCode': 401,
}
```

**post /yandex/exchange**

- назначение: авторизация через яндекс
- параметры: нет настраиваемых передаваемых параметров
- успешный ответ:

```yaml
{
  '_id': '650b396dd4201e5ca499f3b3',
  'username': 'test',
  'phone': '+79999999999',
  'avatar': 'https://i.pravatar.cc/300',
  'balance': 0,
  'accounts':
    [
      {
        '_id': '650b396ed4201e5ca499f3b5',
        'type': 'local',
        'role': 'user',
        'credentials':
          {
            'email': 'test@mail.ru',
            'accessToken': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
            'refreshToken': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
          },
        'profile': '650b396dd4201e5ca499f3b3',
      },
    ],
}
```

**get /vkontakte**

- назначение: авторизация через вконтакте
- параметры: нет настраиваемых передаваемых параметров
- успешный ответ:

```yaml
{
  'username': 'test',
  'phone': '+79999999999',
  'avatar': 'https://i.pravatar.cc/300',
  'balance': 0,
  'accounts':
    [
      {
        'type': 'vk',
        'role': 'user',
        'credentials':
          {
            'email': 'test@mail.ru',
            'accessToken': 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp',
            'refreshToken': 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp',
          },
        'profile': '650b396dd4201e5ca499f3b3',
        '_id': '650b396dd4201e5ca499f3b3',
      },
    ],
  '_id': '650b396dd4201e5ca499f3b3',
}
```

**get /google**

- назначение: авторизация через google
- параметры: нет настраиваемых передаваемых параметров
- успешный ответ:

```yaml
{
  '_id': '650b396dd4201e5ca499f3b3',
  'username': 'test',
  'phone': '+79999999999',
  'avatar': 'https://i.pravatar.cc/300',
  'balance': 0,
  'accounts':
    [
      {
        '_id': '650b396ed4201e5ca499f3b5',
        'type': 'local',
        'role': 'user',
        'credentials':
          {
            'email': 'test@mail.ru',
            'accessToken': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
            'refreshToken': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
          },
        'profile': '650b396dd4201e5ca499f3b3',
      },
    ],
}
```

**post /reset-password**

- назначение: сброс пароля
- параметры:

```yaml
{ 'email': 'test@mail.ru' }
```

- успешный ответ:

```yaml
{ 'message': 'Ссылка на сброс пароля отправлена на ваш email: test@mail.ru' }
```

- ответ с ошибкой:

```yaml
{
  'message': 'Пользователь с указанным Email не найден',
  'error': 'Not Found',
  'statusCode': 404,
}
```

### Accounts. Методы работы с аккаунтами пользователей.

**get /accounts**

- назначение: получить все аккаунты
- параметры: нет настраиваемых передаваемых параметров
- успешный ответ:

```yaml
[
  {
    'type': 'local',
    'role': 'admin',
    'credentials':
      {
        'email': 'my@mail.ru',
        'password': 'password123',
        'accessToken': 'dkskddksldlslsajsjsdsk,cmksjdksdjskjdk',
        'refreshToken': 'dkskddksldlslsajsjsdsk,cmksjdksdjskjdk',
      },
    'profile':
      {
        'username': 'Ivan Ivanov',
        'phone': '+79501364578',
        'avatar': 'https://i.pravatar.cc/300',
        'balance': 1400,
        'accounts': ['string'],
      },
  },
]
```

- ответ с ошибкой:

```yaml
Отказ в доступе
```

**patch /accounts/{id}**

- назначение: обновить данные аккаунта по id
- параметры:

```yaml
url params:
id: 64f81ba37571bfaac18a857f
```

```yaml
body:
{
  "type": "local",
  "role": "admin",
  "credentials": {
    "email": "my@mail.ru",
    "password": "password123",
    "accessToken": "dkskddksldlslsajsjsdsk,cmksjdksdjskjdk",
    "refreshToken": "dkskddksldlslsajsjsdsk,cmksjdksdjskjdk"
  }
}
```

- успешный ответ:

```yaml
{
  'type': 'local',
  'role': 'admin',
  'credentials':
    {
      'email': 'my@mail.ru',
      'password': 'password123',
      'accessToken': 'dkskddksldlslsajsjsdsk,cmksjdksdjskjdk',
      'refreshToken': 'dkskddksldlslsajsjsdsk,cmksjdksdjskjdk',
    },
  'profile':
    {
      'username': 'Ivan Ivanov',
      'phone': '+79501364578',
      'avatar': 'https://i.pravatar.cc/300',
      'balance': 1400,
      'accounts': ['string'],
    },
}
```

- ответ с ошибкой:

```yaml
400	Неверный запрос
403	Отказ в доступе
404	Ресурс не найден
```

### Porfiles. Методы работы с профилями пользователей.

**post /profiles**

- назначение: создать новый профиль
- параметры:

```yaml
{
  'username': 'Ivan Ivanov',
  'phone': '+79501364578',
  'avatar': 'https://i.pravatar.cc/300',
  'balance': 1400,
  'accounts':
    [
      {
        'type': 'local',
        'role': 'admin',
        'credentials':
          {
            'email': 'my@mail.ru',
            'password': 'password123',
            'accessToken': 'dkskddksldlslsajsjsdsk,cmksjdksdjskjdk',
            'refreshToken': 'dkskddksldlslsajsjsdsk,cmksjdksdjskjdk',
          },
        'profile':
          {
            'username': 'Ivan Ivanov',
            'phone': '+79501364578',
            'avatar': 'https://i.pravatar.cc/300',
            'balance': 1400,
            'accounts': ['string'],
          },
      },
    ],
}
```

- успешный ответ:

```yaml
{
  'username': 'Ivan Ivanov',
  'phone': '+79501364578',
  'avatar': 'https://i.pravatar.cc/300',
  'balance': 1400,
  'accounts': ['string'],
}
```

- ответ с ошибкой:

```yaml
400	Неверный запрос
403	Отказ в доступе
```

**get /profiles/me**

- назначение: получить текущий профиль
- параметры: Access токен
- успешный ответ:

```yaml
[
  {
    'username': 'Ivan Ivanov',
    'phone': '+79501364578',
    'avatar': 'https://i.pravatar.cc/300',
    'balance': 1400,
    'accounts': ['string'],
  },
]
```

**get /profiles/{id}**

- назначение: получить профиль по id
- параметры:

```yaml
url params:
id: 64f81ba37571bfaac18a857f
```

- успешный ответ:

```yaml
{
  'username': 'Ivan Ivanov',
  'phone': '+79501364578',
  'avatar': 'https://i.pravatar.cc/300',
  'balance': 1400,
  'accounts': ['string'],
}
```

- ответ с ошибкой:

```yaml
403	Отказ в доступе
404	Ресурс не найден
```

**get /profiles/{id}**

- назначение: обновить данные профиля по id
- параметры:

```yaml
url params:
id: 64f81ba37571bfaac18a857f
```

```yaml
{
  'username': 'Ivan Ivanov',
  'phone': '+79501364578',
  'avatar': 'https://i.pravatar.cc/300',
  'balance': 1400,
}
```

- успешный ответ:

```yaml
{
  'username': 'Ivan Ivanov',
  'phone': '+79501364578',
  'avatar': 'https://i.pravatar.cc/300',
  'balance': 1400,
  'accounts': ['string'],
}
```

- ответ с ошибкой:

```yaml
400	Неверный запрос
403	Отказ в доступе
404	Ресурс не найден
```

**patch /profiles/{id}**

- назначение: обновить данные профиля по id
- параметры:

```yaml
url params:
id: 64f81ba37571bfaac18a857f
```

```yaml
{
  'username': 'Ivan Ivanov',
  'phone': '+79501364578',
  'avatar': 'https://i.pravatar.cc/300',
  'balance': 1400,
}
```

- успешный ответ:

```yaml
{
  'username': 'Ivan Ivanov',
  'phone': '+79501364578',
  'avatar': 'https://i.pravatar.cc/300',
  'balance': 1400,
  'accounts': ['string'],
}
```

- ответ с ошибкой:

```yaml
400	Неверный запрос
403	Отказ в доступе
404	Ресурс не найден
```

**delete /profiles/{id}**

- назначение: удалить профиль по id
- параметры:

```yaml
url params:
id: 64f81ba37571bfaac18a857f
```

- успешный ответ:

```yaml
{
  'username': 'Ivan Ivanov',
  'phone': '+79501364578',
  'avatar': 'https://i.pravatar.cc/300',
  'balance': 1400,
  'accounts': ['string'],
}
```

- ответ с ошибкой:

```yaml
403	Отказ в доступе
404	Ресурс не найден
```

**get /profiles/{id}/accounts**

- назначение: получить все аккаунты пользователя по id профиля
- параметры:

```yaml
url params:
id: 64f81ba37571bfaac18a857f
```

- успешный ответ:

```yaml
[
  {
    'type': 'local',
    'role': 'admin',
    'credentials':
      {
        'email': 'my@mail.ru',
        'password': 'password123',
        'accessToken': 'dkskddksldlslsajsjsdsk,cmksjdksdjskjdk',
        'refreshToken': 'dkskddksldlslsajsjsdsk,cmksjdksdjskjdk',
      },
    'profile':
      {
        'username': 'Ivan Ivanov',
        'phone': '+79501364578',
        'avatar': 'https://i.pravatar.cc/300',
        'balance': 1400,
        'accounts': ['string'],
      },
  },
]
```

- ответ с ошибкой:

```yaml
403	Отказ в доступе
404	Ресурс не найден
```

### Bot tepmlates. Методы работы с шаблонами ботов.

**get /botTemplates**

- назначение: список шаблонов ботов
- параметры: нет настраиваемых передаваемых параметров
- успешный ответ:

```yaml
[
  {
    'icon': 'https://cdn.icon-icons.com/icons2/1233/PNG/512/1492718766-vk_83600.png',
    'title': 'Доставка еды',
    'description': 'Бот для создания заказов',
    'features': ['Создание заказов', 'Редактирование заказов'],
    'settings':
      {
        'Приветствие': 'Я бот для создания заказов',
        'Инлайн_кнопка': 'Текст кнопки',
      },
  },
]
```

- ответ с ошибкой:

```yaml
403	Отказ в доступе
```

**post /botTemplates**

- назначение: создать шаблон бота
- параметры:

```yaml
{
  'icon': 'https://cdn.icon-icons.com/icons2/1233/PNG/512/1492718766-vk_83600.png',
  'title': 'Доставка еды',
  'description': 'Бот для создания заказов',
  'features': ['Создание заказов', 'Редактирование заказов'],
  'settings':
    {
      'Приветствие': 'Я бот для создания заказов',
      'Инлайн_кнопка': 'Текст кнопки',
    },
}
```

- успешный ответ:

```yaml
{
  'icon': 'https://cdn.icon-icons.com/icons2/1233/PNG/512/1492718766-vk_83600.png',
  'title': 'Доставка еды',
  'description': 'Бот для создания заказов',
  'features': ['Создание заказов', 'Редактирование заказов'],
  'settings':
    {
      'Приветствие': 'Я бот для создания заказов',
      'Инлайн_кнопка': 'Текст кнопки',
    },
}
```

- ответ с ошибкой:

```yaml
400	Неверный запрос
403	Отказ в доступе
```

**get /botTemplates/{id}**

- назначение: получить шаблон бота по id
- параметры:

```yaml
url params:
id: 64f81ba37571bfaac18a857f
```

- успешный ответ:

```yaml
{
  'icon': 'https://cdn.icon-icons.com/icons2/1233/PNG/512/1492718766-vk_83600.png',
  'title': 'Доставка еды',
  'description': 'Бот для создания заказов',
  'features': ['Создание заказов', 'Редактирование заказов'],
  'settings':
    {
      'Приветствие': 'Я бот для создания заказов',
      'Инлайн_кнопка': 'Текст кнопки',
    },
}
```

- ответ с ошибкой:

```yaml
403	Отказ в доступе
404	Ресурс не найден
```

**patch /botTemplates/{id}**

- назначение: изменить шаблон бота по id
- параметры:

```yaml
url params:
id: 64f81ba37571bfaac18a857f
```

```yaml
{
  'icon': 'https://cdn.icon-icons.com/icons2/1233/PNG/512/1492718766-vk_83600.png',
  'title': 'Доставка еды',
  'description': 'Бот для создания заказов',
  'features': ['Создание заказов', 'Редактирование заказов'],
  'settings':
    {
      'Приветствие': 'Я бот для создания заказов',
      'Инлайн_кнопка': 'Текст кнопки',
    },
}
```

- успешный ответ:

```yaml
{
  'icon': 'https://cdn.icon-icons.com/icons2/1233/PNG/512/1492718766-vk_83600.png',
  'title': 'Доставка еды',
  'description': 'Бот для создания заказов',
  'features': ['Создание заказов', 'Редактирование заказов'],
  'settings':
    {
      'Приветствие': 'Я бот для создания заказов',
      'Инлайн_кнопка': 'Текст кнопки',
    },
}
```

- ответ с ошибкой:

```yaml
400	Неверный запрос
403	Отказ в доступе
404	Ресурс не найден
```

### Bots. Методы работы с функциональностью ботов.

**get /bots**

- назначение: список ботов пользователей
- параметры: нет настраиваемых передаваемых параметров
- успешный ответ:

```yaml
[
  {
    'icon': 'https://cdn.icon-icons.com/icons2/1233/PNG/512/1492718766-vk_83600.png',
    'botName': 'Бот Автоответчик',
    'profile':
      {
        'username': 'Ivan Ivanov',
        'phone': '+79501364578',
        'avatar': 'https://i.pravatar.cc/300',
        'balance': 1400,
        'accounts': ['string'],
      },
    'messenger':
      {
        'name': 'VK',
        'page': 'vk.com/club1245321223',
        'accessKey': '1685494522:AAHzRs4YFqckLvBVARVoUL0c3B1GFqlDpo',
        'url': 'some_url',
      },
    'botSettings': {},
  },
]
```

- ответ с ошибкой:

```yaml
403	Отказ в доступе
404	Ресурс не найден
```

**post /bots**

- назначение: создания нового бота
- параметры:

```yaml
{
  'icon': 'https://cdn.icon-icons.com/icons2/1233/PNG/512/1492718766-vk_83600.png',
  'botName': 'Бот Автоответчик',
  'messenger':
    {
      'name': 'VK',
      'page': 'vk.com/club1245321223',
      'accessKey': '1685494522:AAHzRs4YFqckLvBVARVoUL0c3B1GFqlDpo',
      'url': 'some_url',
    },
  'botSettings': {},
}
```

- успешный ответ:

```yaml
{
  'icon': 'https://cdn.icon-icons.com/icons2/1233/PNG/512/1492718766-vk_83600.png',
  'botName': 'Бот Автоответчик',
  'profile':
    {
      'username': 'Ivan Ivanov',
      'phone': '+79501364578',
      'avatar': 'https://i.pravatar.cc/300',
      'balance': 1400,
      'accounts': ['string'],
    },
  'messenger':
    {
      'name': 'VK',
      'page': 'vk.com/club1245321223',
      'accessKey': '1685494522:AAHzRs4YFqckLvBVARVoUL0c3B1GFqlDpo',
      'url': 'some_url',
    },
  'botSettings': {},
}
```

- ответ с ошибкой:

```yaml
400	Неверный запрос
403	Отказ в доступе
```

**delete /bots/{id}**

- назначение: удаление бота
- параметры:

```yaml
url params:
id: 64f81ba37571bfaac18a857f
```

- успешный ответ:

```yaml
{
  'icon': 'https://cdn.icon-icons.com/icons2/1233/PNG/512/1492718766-vk_83600.png',
  'botName': 'Бот Автоответчик',
  'profile':
    {
      'username': 'Ivan Ivanov',
      'phone': '+79501364578',
      'avatar': 'https://i.pravatar.cc/300',
      'balance': 1400,
      'accounts': ['string'],
    },
  'messenger':
    {
      'name': 'VK',
      'page': 'vk.com/club1245321223',
      'accessKey': '1685494522:AAHzRs4YFqckLvBVARVoUL0c3B1GFqlDpo',
      'url': 'some_url',
    },
  'botSettings': {},
}
```

- ответ с ошибкой:

```yaml
403	Отказ в доступе
404	Ресурс не найден
```

**patch /bots/{id}**

- назначение: смена имени бота
- параметры:

```yaml
url params:
id: 64f81ba37571bfaac18a857f
```

```yaml
{ 'botName': 'Салон красоты' }
```

- успешный ответ:

```yaml
{
  'icon': 'https://cdn.icon-icons.com/icons2/1233/PNG/512/1492718766-vk_83600.png',
  'botName': 'Бот Автоответчик',
  'profile':
    {
      'username': 'Ivan Ivanov',
      'phone': '+79501364578',
      'avatar': 'https://i.pravatar.cc/300',
      'balance': 1400,
      'accounts': ['string'],
    },
  'messenger':
    {
      'name': 'VK',
      'page': 'vk.com/club1245321223',
      'accessKey': '1685494522:AAHzRs4YFqckLvBVARVoUL0c3B1GFqlDpo',
      'url': 'some_url',
    },
  'botSettings': {},
}
```

- ответ с ошибкой:

```yaml
403	Отказ в доступе
404	Ресурс не найден
```

**get /bots/{id}**

- назначение: получить данные бота по id
- параметры:

```yaml
url params:
id: 64f81ba37571bfaac18a857f
```

- успешный ответ:

```yaml
{
  'icon': 'https://cdn.icon-icons.com/icons2/1233/PNG/512/1492718766-vk_83600.png',
  'botName': 'Бот Автоответчик',
  'profile':
    {
      'username': 'Ivan Ivanov',
      'phone': '+79501364578',
      'avatar': 'https://i.pravatar.cc/300',
      'balance': 1400,
      'accounts': ['string'],
    },
  'messenger':
    {
      'name': 'VK',
      'page': 'vk.com/club1245321223',
      'accessKey': '1685494522:AAHzRs4YFqckLvBVARVoUL0c3B1GFqlDpo',
      'url': 'some_url',
    },
  'botSettings': {},
}
```

- ответ с ошибкой:

```yaml
403	Отказ в доступе
404	Ресурс не найден
```

**post /bots/{id}/copy**

- назначение: копирование бота
- параметры:

```yaml
url params:
id: 64f81ba37571bfaac18a857f
```

```yaml
{
  'messenger':
    {
      'name': 'VK',
      'page': 'vk.com/club1245321223',
      'accessKey': '1685494522:AAHzRs4YFqckLvBVARVoUL0c3B1GFqlDpo',
      'url': 'some_url',
    },
}
```

- успешный ответ:

```yaml
{
  'icon': 'https://cdn.icon-icons.com/icons2/1233/PNG/512/1492718766-vk_83600.png',
  'botName': 'Бот Автоответчик',
  'profile':
    {
      'username': 'Ivan Ivanov',
      'phone': '+79501364578',
      'avatar': 'https://i.pravatar.cc/300',
      'balance': 1400,
      'accounts': ['string'],
    },
  'messenger':
    {
      'name': 'VK',
      'page': 'vk.com/club1245321223',
      'accessKey': '1685494522:AAHzRs4YFqckLvBVARVoUL0c3B1GFqlDpo',
      'url': 'some_url',
    },
  'botSettings': {},
}
```

- ответ с ошибкой:

```yaml
400	Неверный запрос
403	Отказ в доступе
404	Ресурс не найден
```

**post /bots/{id}/share**

- назначение: предоставить общий доступ к боту, первичный доступ при отправке email
- параметры:

```yaml
url params:
id: 64f81ba37571bfaac18a857f
```

```yaml
{ 'email': 'test@test.ru' }
```

- успешный ответ:

```yaml
{
  'icon': 'https://cdn.icon-icons.com/icons2/1233/PNG/512/1492718766-vk_83600.png',
  'botName': 'Бот Автоответчик',
  'profile':
    {
      'username': 'Ivan Ivanov',
      'phone': '+79501364578',
      'avatar': 'https://i.pravatar.cc/300',
      'balance': 1400,
      'accounts': ['string'],
    },
  'messenger':
    {
      'name': 'VK',
      'page': 'vk.com/club1245321223',
      'accessKey': '1685494522:AAHzRs4YFqckLvBVARVoUL0c3B1GFqlDpo',
      'url': 'some_url',
    },
  'botSettings': {},
}
```

- ответ с ошибкой:

```yaml
400	Неверный запрос
403	Отказ в доступе
404	Ресурс не найден
```

### Bot accesses. Методы управления доступа к ботам.

**post /bot-accesses**

- назначение: Создает запись о доступе пользователя к боту, используется при создании бота
- параметры:

```yaml
{ 'botId': '64ff94ef12477f1d0934c614', 'permission': { 'voronki': 'viewer' } }
```

- успешный ответ:

```yaml
{
  '_id': '64ff89e7faea577804940275',
  'userId': '64ff89e7faea577804940275',
  'botId': '64ff89e7faea577804940275',
  'permission':
    {
      'voronki': 'editor',
      'newsletters': 'editor',
      'lists': 'editor',
      'statistic': 'editor',
      'dialogs': 'editor',
      'crm': 'editor',
      'mini_landing': 'editor',
    },
  'createdAt': '2023-09-12T15:29:12.117Z',
  'updatedAt': '2023-09-12T15:29:12.117Z',
}
```

- ответ с ошибкой:

```yaml
400	Неверный запрос
403	Отказ в доступе
```

**get /bot-accesses**

- назначение: найти все доступы
- параметры: нет настраиваемых передаваемых параметров
- успешный ответ:

```yaml
[
  {
    '_id': '64ff89e7faea577804940275',
    'userId': '64ff89e7faea577804940275',
    'botId': '64ff89e7faea577804940275',
    'permission':
      {
        'voronki': 'editor',
        'newsletters': 'editor',
        'lists': 'editor',
        'statistic': 'editor',
        'dialogs': 'editor',
        'crm': 'editor',
        'mini_landing': 'editor',
      },
    'createdAt': '2023-09-12T15:29:12.117Z',
    'updatedAt': '2023-09-12T15:29:12.117Z',
  },
]
```

- ответ с ошибкой:

```yaml
403	Отказ в доступе
```

**get /bot-accesses/{id}**

- назначение: найти доступ по id
- параметры:

```yaml
url params:
id: 64f81ba37571bfaac18a857f
```

- успешный ответ:

```yaml
{
  '_id': '64ff89e7faea577804940275',
  'userId': '64ff89e7faea577804940275',
  'botId': '64ff89e7faea577804940275',
  'permission':
    {
      'voronki': 'editor',
      'newsletters': 'editor',
      'lists': 'editor',
      'statistic': 'editor',
      'dialogs': 'editor',
      'crm': 'editor',
      'mini_landing': 'editor',
    },
  'createdAt': '2023-09-12T15:29:12.117Z',
  'updatedAt': '2023-09-12T15:29:12.117Z',
}
```

- ответ с ошибкой:

```yaml
403	Отказ в доступе
404	Ресурс не найден
```

**patch /bot-accesses/{id}**

- назначение: Изменяет уровень существующего доступа. Должен передаваться полностью объект с теми доступами, которые должны быть у пользователя.
- параметры:

```yaml
url params:
id: 64f81ba37571bfaac18a857f
```

```yaml
{
  'permission':
    {
      'voronki': 'editor',
      'newsletters': 'editor',
      'lists': 'editor',
      'statistic': 'editor',
      'dialogs': 'editor',
      'crm': 'editor',
      'mini_landing': 'editor',
    },
}
```

- успешный ответ:

```yaml
{
  '_id': '64ff89e7faea577804940275',
  'userId': '64ff89e7faea577804940275',
  'botId': '64ff89e7faea577804940275',
  'permission':
    {
      'voronki': 'editor',
      'newsletters': 'editor',
      'lists': 'editor',
      'statistic': 'editor',
      'dialogs': 'editor',
      'crm': 'editor',
      'mini_landing': 'editor',
    },
  'createdAt': '2023-09-12T15:29:12.117Z',
  'updatedAt': '2023-09-12T15:29:12.117Z',
}
```

- ответ с ошибкой:

```yaml
400	Неверный запрос
403	Отказ в доступе
404	Ресурс не найден
```

**delete /bot-accesses/{id}**

- назначение: удалить доступ по id
- параметры:

```yaml
url params:
id: 64f81ba37571bfaac18a857f
```

- успешный ответ:

```yaml
{
  '_id': '64ff89e7faea577804940275',
  'userId': '64ff89e7faea577804940275',
  'botId': '64ff89e7faea577804940275',
  'permission':
    {
      'voronki': 'editor',
      'newsletters': 'editor',
      'lists': 'editor',
      'statistic': 'editor',
      'dialogs': 'editor',
      'crm': 'editor',
      'mini_landing': 'editor',
    },
  'createdAt': '2023-09-12T15:29:12.117Z',
  'updatedAt': '2023-09-12T15:29:12.117Z',
}
```

- ответ с ошибкой:

```yaml
403	Отказ в доступе
404	Ресурс не найден
```

**get /bot-accesses/{userId}/{botId}**

- назначение: Позвоялет проверить уровень доступа по botId и userId
- параметры:

```yaml
url params:
userId: 64f81ba37571bfaac18a857f
botId: 64f81ba37571bfaac18a857f
```

- успешный ответ:

```yaml
'Unknown Type: Permission'
```

- ответ с ошибкой:

```yaml
403	Отказ в доступе
404	Ресурс не найден
```

**post /bot-accesses/{botId}**

- назначение: Позвоялет поделиться доступом по botId и создать новый доступ, если пользователь имеет полный уровень доступа к данному боту
- параметры:

```yaml
url params:
botId: 64f81ba37571bfaac18a857f
```

```yaml
{ 'email': 'test@test.ru', 'permission': { 'voronki': 'viewer' } }
```

- успешный ответ:

```yaml
{
  '_id': '64ff89e7faea577804940275',
  'userId': '64ff89e7faea577804940275',
  'botId': '64ff89e7faea577804940275',
  'permission':
    {
      'voronki': 'editor',
      'newsletters': 'editor',
      'lists': 'editor',
      'statistic': 'editor',
      'dialogs': 'editor',
      'crm': 'editor',
      'mini_landing': 'editor',
    },
  'createdAt': '2023-09-12T15:29:12.117Z',
  'updatedAt': '2023-09-12T15:29:12.117Z',
}
```

- ответ с ошибкой:

```yaml
400	Неверный запрос
403	Отказ в доступе
404	Ресурс не найден
```

### Platforms. Методы работы с подключаемыми платформами.

**post /platforms**

- назначение: создать новую платформу
- параметры:

```yaml
{
  'icon': 'https://cdn.icon-icons.com/icons2/1233/PNG/512/1492718766-vk_83600.png',
  'title': 'VK',
  'formFields':
    { 'name': true, 'pages': true, 'accessKey': false, 'url': true },
}
```

- успешный ответ:

```yaml
{
  'icon': 'https://cdn.icon-icons.com/icons2/1233/PNG/512/1492718766-vk_83600.png',
  'title': 'VK',
  'formFields':
    { 'name': true, 'pages': true, 'accessKey': false, 'url': true },
}
```

- ответ с ошибкой:

```yaml
400	Неверный запрос
403	Отказ в доступе
```

**get /platforms**

- назначение: получить все платформы
- параметры: нет настраиваемых передаваемых параметров
- успешный ответ:

```yaml
[
  {
    'icon': 'https://cdn.icon-icons.com/icons2/1233/PNG/512/1492718766-vk_83600.png',
    'title': 'VK',
    'formFields':
      { 'name': true, 'pages': true, 'accessKey': false, 'url': true },
  },
]
```

- ответ с ошибкой:

```yaml
403	Отказ в доступе
```

**get /platforms/{id}**

- назначение: получить платформу по id
- параметры:

```yaml
url params:
id: 64f81ba37571bfaac18a857f
```

- успешный ответ:

```yaml
{
  'icon': 'https://cdn.icon-icons.com/icons2/1233/PNG/512/1492718766-vk_83600.png',
  'title': 'VK',
  'formFields':
    { 'name': true, 'pages': true, 'accessKey': false, 'url': true },
}
```

- ответ с ошибкой:

```yaml
403	Отказ в доступе
404	Ресурс не найден
```

**patch /platforms/{id}**

- назначение: обновить данные о платформе по id
- параметры:

```yaml
url params:
id: 64f81ba37571bfaac18a857f
```

```yaml
{
  'icon': 'https://cdn.icon-icons.com/icons2/1233/PNG/512/1492718766-vk_83600.png',
  'title': 'VK',
  'formFields':
    { 'name': true, 'pages': true, 'accessKey': false, 'url': true },
}
```

- успешный ответ:

```yaml
{
  'icon': 'https://cdn.icon-icons.com/icons2/1233/PNG/512/1492718766-vk_83600.png',
  'title': 'VK',
  'formFields':
    { 'name': true, 'pages': true, 'accessKey': false, 'url': true },
}
```

- ответ с ошибкой:

```yaml
400	Неверный запрос
403	Отказ в доступе
404	Ресурс не найден
```

**delete /platforms/{id}**

- назначение: удалить платформу по id
- параметры:

```yaml
url params:
id: 64f81ba37571bfaac18a857f
```

- успешный ответ:

```yaml
{
  'icon': 'https://cdn.icon-icons.com/icons2/1233/PNG/512/1492718766-vk_83600.png',
  'title': 'VK',
  'formFields':
    { 'name': true, 'pages': true, 'accessKey': false, 'url': true },
}
```

- ответ с ошибкой:

```yaml
403	Отказ в доступе
404	Ресурс не найден
```

### Tariffs. Методы работы с тарифами.

**get /tariffs**

- назначение: получить все тарифы
- параметры: нет настраиваемых передаваемых параметров
- успешный ответ:

```yaml
[{ 'name': 'Старт', 'price': 390 }]
```

- ответ с ошибкой:

```yaml
403	Отказ в доступе
```

**post /tariffs**

- назначение: добавить новый тариф
- параметры:

```yaml
{ 'name': 'Старт', 'price': 390 }
```

- успешный ответ:

```yaml
{ 'name': 'Старт', 'price': 390 }
```

- ответ с ошибкой:

```yaml
400	Неверный запрос
403	Отказ в доступе
409 Такой тариф уже существует
```

**get /tariffs/{id}**

- назначение: получить тариф по id
- параметры:

```yaml
url params:
id: 64f81ba37571bfaac18a857f
```

- успешный ответ:

```yaml
{ 'name': 'Старт', 'price': 390 }
```

- ответ с ошибкой:

```yaml
403	Отказ в доступе
404	Ресурс не найден
```

**patch /tariffs/{id}**

- назначение: обновить тариф по id
- параметры:

```yaml
url params:
id: 64f81ba37571bfaac18a857f
```

```yaml
{ 'name': 'Новый старт!', 'price': 490 }
```

- успешный ответ:

```yaml
{ 'name': 'Старт', 'price': 390 }
```

- ответ с ошибкой:

```yaml
400	Неверный запрос
403	Отказ в доступе
404	Ресурс не найден
```

**delete /tariffs/{id}**

- назначение: удалить тариф по id
- параметры:

```yaml
url params:
id: 64f81ba37571bfaac18a857f
```

- успешный ответ:

```yaml
{ 'name': 'Старт', 'price': 390 }
```

- ответ с ошибкой:

```yaml
403	Отказ в доступе
404	Ресурс не найден
```

### Subscriptions. Методы работы с подписками пользователей на тарифы.

**get /subscriptions**

- назначение: данные страницы "Подписки и платежи"
- параметры: нет настраиваемых передаваемых параметров
- успешный ответ:

```yaml
{
  'tariff': 'Бизнес',
  'status': true,
  'cardMask': '4500 *** 1119',
  'debitDate': '2023-09-12',
  'balance': 1234,
  'payments':
    [
      {
        'date': '2023-10-08T16:07:15.386Z',
        'amount': 1000,
        'successful': true,
        'operation': 'Поступление',
        'note': 'Пополнение счета',
      },
    ],
}
```

- ответ с ошибкой:

```yaml
403	Отказ в доступе
404	Ресурс не найден
```

**post /subscriptions/activate**

- назначение: активировать или отменить подписку
- параметры:

```yaml
{ 'status': true }
```

- успешный ответ:

```yaml
{
  'status': true,
  'cardMask': '4500 *** 1119',
  'debitDate': '2023-10-08T16:07:15.385Z',
}
```

- ответ с ошибкой:

```yaml
400	Неверный запрос
403	Отказ в доступе
404	Ресурс не найден
```

**post /subscriptions/{id}**

- назначение: оформить подписку
- параметры:

```yaml
url params:
id: 64f81ba37571bfaac18a857f
```

```yaml
{ 'cardMask': '4500 *** 1119', 'debitDate': '2023-09-12' }
```

- успешный ответ:

```yaml
{
  'status': true,
  'cardMask': '4500 *** 1119',
  'debitDate': '2023-10-08T16:07:15.385Z',
}
```

- ответ с ошибкой:

```yaml
400	Неверный запрос
403	Отказ в доступе
404	Ресурс не найден
```

### Payments. Методы работы с платежами пользователей.

**get /payments**

- назначение: получить историю платежей
- параметры: нет настраиваемых передаваемых параметров
- успешный ответ:

```yaml
[
  {
    'date': '2023-10-08T16:07:15.386Z',
    'amount': 1000,
    'successful': true,
    'operation': 'Поступление',
    'note': 'Пополнение счета',
  },
]
```

- ответ с ошибкой:

```yaml
403	Отказ в доступе
```

**post /payments**

- назначение: добавить данные финансовой операции
- параметры:

```yaml
{
  'date': '2023-01-03',
  'amount': 1234,
  'successful': true,
  'operation': 'Поступление',
  'note': 'Пополнение счета',
}
```

- успешный ответ:

```yaml
{
  'date': '2023-10-08T16:07:15.386Z',
  'amount': 1000,
  'successful': true,
  'operation': 'Поступление',
  'note': 'Пополнение счета',
}
```

- ответ с ошибкой:

```yaml
400	Неверный запрос
403	Отказ в доступе
```

**delete /payments/{id}**

- назначение: удалить финансовую операцию
- параметры:

```yaml
url params:
id: 64f81ba37571bfaac18a857f
```

- успешный ответ:

```yaml
200 Операция успешно удалена
```

- ответ с ошибкой:

```yaml
403	Отказ в доступе
404	Ресурс не найден
```

**patch /payments/{id}**

- назначение: обновить данные финансовой операции
- параметры:

```yaml
url params:
id: 64f81ba37571bfaac18a857f
```

```yaml
{
  'date': '2023-01-03',
  'amount': 1234,
  'successful': true,
  'operation': 'Поступление',
  'note': 'Пополнение счета',
}
```

- успешный ответ:

```yaml
{
  'date': '2023-10-08T16:07:15.386Z',
  'amount': 1000,
  'successful': true,
  'operation': 'Поступление',
  'note': 'Пополнение счета',
}
```

- ответ с ошибкой:

```yaml
400	Неверный запрос
403	Отказ в доступе
404	Ресурс не найден
```

### Promocodes. Методы работы с промокодами.

**post /promocodes**

- назначение: добавить новый промокод
- параметры:

```yaml
{
  'code': 'PROMO50',
  'actionPeriod': '2023-09-10T16:07:34.285Z',
  'activationCount': 2,
  'maxActivationCount': 10,
}
```

- успешный ответ:

```yaml
{
  'code': 'PROMO50',
  'actionPeriod': '2023-09-10T16:07:34.285Z',
  'activationCount': 2,
  'maxActivationCount': 10,
}
```

- ответ с ошибкой:

```yaml
403	Отказ в доступе
409 Такой промокод уже существует
```

**get /promocodes**

- назначение: получить все промокоды
- параметры: нет настраиваемых передаваемых параметров
- успешный ответ:

```yaml
[
  {
    'code': 'PROMO50',
    'actionPeriod': '2023-09-10T16:07:34.285Z',
    'activationCount': 2,
    'maxActivationCount': 10,
  },
]
```

- ответ с ошибкой:

```yaml
403	Отказ в доступе
```

**get /promocodes/{id}**

- назначение: получить промокод по id
- параметры:

```yaml
url params:
id: 64f81ba37571bfaac18a857f
```

- успешный ответ:

```yaml
{
  'code': 'PROMO50',
  'actionPeriod': '2023-09-10T16:07:34.285Z',
  'activationCount': 2,
  'maxActivationCount': 10,
}
```

- ответ с ошибкой:

```yaml
403	Отказ в доступе
404	Ресурс не найден
```

**patch /promocodes/{id}**

- назначение: обновить промокод по id
- параметры:

```yaml
url params:
id: 64f81ba37571bfaac18a857f
```

```yaml
{
  'code': 'PROMO100',
  'actionPeriod': '2024-12-10T00:00:00.285Z',
  'activationCount': 2,
  'maxActivationCount': 10,
}
```

- успешный ответ:

```yaml
{
  'code': 'PROMO50',
  'actionPeriod': '2023-09-10T16:07:34.285Z',
  'activationCount': 2,
  'maxActivationCount': 10,
}
```

- ответ с ошибкой:

```yaml
400	Неверный запрос
403	Отказ в доступе
404	Ресурс не найден
```

**delete /promocodes/{id}**

- назначение: удалить промокод по id
- параметры:

```yaml
url params:
id: 64f81ba37571bfaac18a857f
```

- успешный ответ:

```yaml
{
  'code': 'PROMO50',
  'actionPeriod': '2023-09-10T16:07:34.285Z',
  'activationCount': 2,
  'maxActivationCount': 10,
}
```

- ответ с ошибкой:

```yaml
403	Отказ в доступе
404	Ресурс не найден
```

### Notification. Методы работы с уведомлениями для пользователей.

**post /notification**

- назначение: создать уведомление
- параметры:

```yaml
{ 'fromWhom': { 'profileId': {} }, 'toWhom': { 'fromId': {} }, 'message': {} }
```

- успешный ответ:

```yaml
{ 'fromWhom': { 'profileId': {} }, 'toWhom': { 'fromId': {} }, 'message': {} }
```

- ответ с ошибкой:

```yaml
400	Неверный запрос
403	Отказ в доступе
```

**get /notification**

- назначение: получить все уведомления
- параметры: нет настраиваемых передаваемых параметров
- успешный ответ:

```yaml
[
  {
    'fromWhom': { 'profileId': {} },
    'toWhom': { 'fromId': {} },
    'message': {},
    'isReceived': true,
  },
]
```

- ответ с ошибкой:

```yaml
403	Отказ в доступе
```

**get /notification/{id}**

- назначение: получить уведомление по id
- параметры:

```yaml
url params:
id: 64f81ba37571bfaac18a857f
```

- успешный ответ:

```yaml
{
  'fromWhom': { 'profileId': {} },
  'toWhom': { 'fromId': {} },
  'message': {},
  'isReceived': true,
}
```

- ответ с ошибкой:

```yaml
403	Отказ в доступе
404	Ресурс не найден
```

**delete /notification/{id}**

- назначение: удалить уведомление по id
- параметры:

```yaml
url params:
id: 64f81ba37571bfaac18a857f
```

- успешный ответ:

```yaml
{
  'fromWhom': { 'profileId': {} },
  'toWhom': { 'fromId': {} },
  'message': {},
  'isReceived': true,
}
```

- ответ с ошибкой:

```yaml
403	Отказ в доступе
404	Ресурс не найден
```

**patch /notification/{id}**

- назначение: изменить уведомление по id
- параметры:

```yaml
url params:
id: 64f81ba37571bfaac18a857f
```

```yaml
{ 'message': 'Изменены настройки бота', 'isReceived': false }
```

- успешный ответ:

```yaml
{ 'message': 'Изменены настройки бота', 'isReceived': false }
```

- ответ с ошибкой:

```yaml
400	Неверный запрос
403	Отказ в доступе
404	Ресурс не найден
```

### Logout. Методы работы с разлогированием пользователей.

**get /logout**

- назначение: разлогинить пользователя
- параметры: Access токен
- успешный ответ:

```yaml
{ 'message': 'string' }
```