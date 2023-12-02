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

@Catch()
export class GlobalHTTPExceptionFilter implements ExceptionFilter {
  constructor(@Inject(Logger) private readonly logger: LoggerService) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const timestamp = new Date().toISOString();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message || null
        : 'Internal Server Error';

    if (exception instanceof Error) {
      this.logger.error(
        `[${timestamp}] [${request.method}] ${request.url}`,
        exception.stack,
      );
    } else {
      this.logger.error(
        `[${timestamp}] [${request.method}] ${request.url}`,
        exception,
      );
    }

    response.status(status).json({
      message: message,
      statusCode: status,
      timestamp: timestamp,
      path: request.url,
    });
  }
}
