import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Catch()
export class GlobalHTTPExceptionFilter implements ExceptionFilter {
  @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger;

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message || null
        : 'Internal Server Error';

    if (exception instanceof Error) {
      this.logger.log(`[${request.method}] ${request.url}`, exception.stack);
    } else {
      this.logger.log(`[${request.method}] ${request.url}`, exception);
    }

    response.status(status).json({
      message: message,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
