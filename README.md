## Для того чтобы увидеть документацию Swagger

```
http://127.0.0.1:3000/api/docs
```

### Запуск проекта

Для запуска в докер необходимо добавить два .env файла:
- .env(.dev) с конфигурацией приложения
- .env.db с конфигурацией mongodb

Примеры заполнения можно увидеть в .env.example

Запуск проекта в dev режиме происходит в двух вариантах:
- ```npm run start:dev:docker``` в attached режиме
- ``` docker-compose -f docker-compose-dev.yml up -d``` фоново

В обоих случаях поднимаются контейнеры с самим бэком + бд.

Запуск production ``` docker-compose -f docker-compose.yml up -d ```
