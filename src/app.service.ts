import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Я работаю, со мной всё хорошо';
  }
}
