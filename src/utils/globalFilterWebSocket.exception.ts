import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

//-- Глобальный фильтр исключений для обработки всех исключений, возникающих в WebSocket-модуле приложения NestJS --//
@Catch()
export class GlobalWebsocketExceptionFilter implements ExceptionFilter {
  //-- Метод для перехвата и обработки исключений, специфичных для WebSocket --//
  catch(exception: unknown, host: ArgumentsHost) {
    //-- Переключаем контекст на WebSocket для получения клиентского соединения --//
    const ctx = host.switchToWs();
    const client = ctx.getClient();

    //-- Проверяем, является ли перехваченное исключение WsException --//
    if (exception instanceof WsException) {
      //-- Если да, отправляем клиенту сообщение об ошибке через событие 'error' --//
      client.emit('error', {
        timestamp: new Date().toISOString(), // Фиксируем временную метку события
        message: exception.message, // Передаем сообщение ошибки
      });
    }
    //-- В текущей реализации, если исключение не является экземпляром WsException, оно не будет обработано --//
  }
}
//-- Примечание: для использования этого фильтра его необходимо зарегистрировать в WebSocket модуле или гейте, чтобы он мог перехватывать исключения. --//
