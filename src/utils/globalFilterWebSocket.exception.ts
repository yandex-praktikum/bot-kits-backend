import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Catch()
export class GlobalWebsocketExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToWs();
    const client = ctx.getClient();

    if (exception instanceof WsException) {
      client.emit('error', {
        timestamp: new Date().toISOString(),
        message: exception.message,
      });
    }
  }
}
