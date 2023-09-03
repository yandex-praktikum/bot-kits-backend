import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Создаем экземпляр билдера Swagger-документации
  const config = new DocumentBuilder()
    .setTitle('API BotKits')
    .setDescription('Ручки для команды frontend')
    .setVersion('1.0')
    .build(); // завершаем конфигурирование вызовом build

  const document = SwaggerModule.createDocument(app, config);

  // Сохраняем JSON документ в YAML файл
  const yamlDocument = yaml.dump(document);
  fs.writeFileSync('./swagger.yaml', yamlDocument, 'utf8');

  // первый аргумент - путь, по которому будет доступна
  // веб-страница с документацией Swagger
  SwaggerModule.setup('/api/docs', app, document);

  await app.listen(3000);
}

bootstrap();
