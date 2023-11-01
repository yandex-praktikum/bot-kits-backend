import { HttpException, HttpStatus } from '@nestjs/common';

//custom.exception.ts
export class CustomException extends HttpException {
  constructor(message: string, httpStatus: HttpStatus) {
    super(message, httpStatus);
  }
}
