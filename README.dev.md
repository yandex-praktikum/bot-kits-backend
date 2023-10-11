# Запуск проекта

Для запуска в докер необходимо добавить два .env файла:
- .env(.dev) с конфигурацией приложения

Примеры заполнения можно увидеть в .env.example

Запуск проекта в dev режиме происходит в двух вариантах:
- ```npm run start:dev:docker``` в attached режиме
- ```docker-compose -f docker-compose-dev.yml up --env-file .env.dev --env-file .env.db -d``` фоново

В обоих случаях поднимаются контейнеры с самим бэком + бд.

Запуск production ```docker-compose -f docker-compose.yml --env-file .env --env-file .env.db up -d ```

## Для того чтобы увидеть документацию Swagger

```
http://127.0.0.1:<Порт на котором запущен сервер>/api/docs
#Пример http://127.0.0.1:3001/api/docs
```

## Используем pre-commit хуки
Для работы нужно заново скачать зависимости

```
npm i
```

Также поставить глобально commitizen

```
npm i -g commitizen
```

Cделать инициализацию хаски

```
npm run prepare
```

Теперь чтобы сделать коммит вводите команду и дальше следовать инструкциям.

```
git cz 
```

## Для работы mongoDb с транзакциями
Найдите на вашем устройстве свой конфиг где установлена mongoDB
```
mongod.conf
```
добавьте в него строку
```
replication:
  replSetName: "name replication set"
```
Для того чтобы перезапустить MongoDB  с новыми настройками введите, если ошибок и сообщений нет - перезагрузите устройство.
```
mongod --config "путь\до\вашего\mongod.conf"
#Пример notepad "C:\Program Files\MongoDB\Server\4.4\mongod.conf"
```
Далее зайдите в MongoDB shell для этого в терминале введите 
```
mongo
```
После успешного подключения проинициализируйте репликацию
```
rs.initiate()
```
Убедитесь, что все ок проверьте статус 
```
rs.status()
```
В env файлики добавьте  
```
DB_REPLICATION_SET=name replication set
```
