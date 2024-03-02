import { transports, format } from 'winston';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';

//-- Фабрика для создания настроенного логгера с использованием библиотеки Winston для приложений NestJS --//
export const LoggerFactory = (appName: string) => {
  //-- Настраиваем формат вывода для консоли --//
  const consoleFormat = format.combine(
    format.timestamp(), // Добавляем временную метку к каждому сообщению
    format.ms(), // Показываем время, прошедшее с предыдущего логированного сообщения
    nestWinstonModuleUtilities.format.nestLike(appName, {
      // Используем форматирование, похожее на NestJS
      colors: true, // Включаем цвета для улучшения читаемости
      prettyPrint: true, // Включаем красивый вывод объектов
    }),
  );

  //-- Возвращаем инстанс логгера Winston с настроенными транспортами --//
  return WinstonModule.createLogger({
    transports: [
      //-- Транспорт для вывода логов в консоль с настроенным форматом --//
      new transports.Console({ format: consoleFormat }),
      //-- Транспорт для записи ошибок в файл 'error.log' --//
      new transports.File({
        filename: 'error.log', // Имя файла для записи
        level: 'error', // Уровень логирования, в этом случае записываем только ошибки
        format: format.simple(), // Используем простой формат для файлового вывода
      }),
    ],
  });
};
