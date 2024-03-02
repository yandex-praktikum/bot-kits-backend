import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  LoggerService,
} from '@nestjs/common';

//-- Глобальный фильтр исключений для обработки всех исключений в приложении NestJS --//
@Catch()
export class GlobalHTTPExceptionFilter implements ExceptionFilter {
  //-- Внедряем сервис логирования для регистрации ошибок --//
  constructor(@Inject(Logger) private readonly logger: LoggerService) {}

  //-- Метод для перехвата и обработки исключений --//
  async catch(exception: unknown, host: ArgumentsHost) {
    //-- Получаем объекты HTTP-запроса и ответа из контекста выполнения --//
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    //-- Фиксируем временную метку для логирования --//
    const timestamp = new Date().toISOString();

    //-- Определяем статус HTTP-ответа. По умолчанию используем 500 Internal Server Error --//
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    //-- Формируем сообщение об ошибке для ответа клиенту --//
    const message =
      exception instanceof HttpException
        ? exception.message || null
        : 'Internal Server Error';

    //-- Логируем детали ошибки, включая стек вызова, если это экземпляр Error --//
    if (exception instanceof Error) {
      this.logger.error(
        `[${timestamp}] [${request.method}] ${request.url}`,
        exception.stack,
      );
    } else {
      //-- Логируем ошибку, если это не экземпляр Error --//
      this.logger.error(
        `[${timestamp}] [${request.method}] ${request.url}`,
        exception,
      );
    }

    //-- Отправляем ответ клиенту, содержащий информацию об ошибке --//
    response.status(status).json({
      message: message,
      statusCode: status,
      timestamp: timestamp,
      path: request.url,
    });
  }
}
