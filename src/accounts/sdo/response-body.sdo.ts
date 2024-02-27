import { HttpStatus } from '@nestjs/common';
import {
  ApiPropertyFactory,
  IFieldDescription,
  createField,
  createNestedObject,
} from 'src/utils/apiPropertyFactory';

export const credentialsDescription: IFieldDescription = createNestedObject([
  createField('email', 'test@mail.ru', 'string'),
  createField('accessToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', 'string'),
  createField('refreshToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', 'string'),
]);

const accountDescription: IFieldDescription[] = [
  createField('_id', '6516ab8f2c612e8cce53e45f', 'string'),
  createField('type', 'local', 'string'),
  createField('role', 'user', 'string'),
  { ...credentialsDescription, key: 'credentials' },
  createField('profile', '6516ab8f2c612e8cce53e45d', 'string'),
];

const invalidTokenResponse: IFieldDescription[] = [
  createField('message', 'Unauthorized', 'string', 'Сообщение об ошибке'),
  createField(
    'statusCode',
    HttpStatus.UNAUTHORIZED,
    'number',
    'HTTP-статус код',
  ),
  createField(
    'timestamp',
    '2024-02-04T12:37:00.127Z',
    'string',
    'Время возникновения ошибки',
  ),
  createField(
    'path',
    '/dev/api/accounts',
    'string',
    'Путь возникновения ошибки',
  ),
];

const badRequestResponse: IFieldDescription[] = [
  createField(
    'message',
    'Bad Request Exception',
    'string',
    'Сообщение об ошибке',
  ),
  createField(
    'statusCode',
    HttpStatus.BAD_REQUEST,
    'number',
    'HTTP-статус код',
  ),
  createField(
    'timestamp',
    '2024-02-04T12:37:00.127Z',
    'string',
    'Время возникновения ошибки',
  ),
  createField(
    'path',
    '/dev/api/accounts/65bf68aaaf2c1d8d0eb88180',
    'string',
    'Путь возникновения ошибки',
  ),
];

export const SingleAccountResponseBodyOK = new ApiPropertyFactory(
  accountDescription,
).generate('SingleAccountResponseBodyOK');

export const InvalidTokenResponse = new ApiPropertyFactory(
  invalidTokenResponse,
).generate('InvalidTokenResponse');

export const BadRequestResponse = new ApiPropertyFactory(
  badRequestResponse,
).generate('BadRequestResponse');
