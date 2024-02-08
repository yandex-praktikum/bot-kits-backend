import { HttpStatus } from '@nestjs/common';
import {
  ApiPropertyFactory,
  IFieldDescription,
  createField,
  createNestedObject,
} from 'src/utils/apiPropertyFactory';

const credentialsDescription: IFieldDescription = createNestedObject([
  createField('email', 'test@mail.ru', 'string'),
  createField('accessToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', 'string'),
  createField(
    'refreshToken',
    'eyJhbGciOiJIUzI1NiIsInR5cPCI6IkpXVCJ9',
    'string',
  ),
]);

const profileDescription: IFieldDescription = createNestedObject([
  createField('_id', '650b396dd4201e5ca499f3b3', 'string'),
  createField('username', 'test', 'string'),
  createField('phone', '+79999999999', 'string'),
  createField('avatar', 'https://i.pravatar.cc/300', 'string'),
  createField('balance', 0, 'number'),
  createField('referredUsers', [], 'array'),
  createField('visited_ref', 0, 'number'),
  createField('registration_ref', 0, 'number'),
  createField('promocode', [], 'array'),
  createField('partner_ref', '1234abc', 'string'),
]);

const accountsDescription: IFieldDescription[] = [
  createField('_id', '650b396ed4201e5ca499f3b5', 'string'),
  createField('type', 'local', 'string'),
  createField('role', 'user', 'string'),
  { ...credentialsDescription, key: 'credentials' },
  { ...profileDescription, key: 'profile' },
];

const badRequestSigninDescription: IFieldDescription[] = [
  createField(
    'message',
    'Неверное имя пользователя или пароль',
    'string',
    'Сообщение об ошибке',
  ),
  createField(
    'statusCode',
    HttpStatus.UNAUTHORIZED,
    'number',
    'HTTP-статус код',
  ),
  createField(
    'timestamp',
    '2024-02-04T10:41:34.656Z',
    'string',
    'Время возникновения ошибки',
  ),
  createField('path', '/dev/api/signin', 'string', 'Путь возникновения ошибки'),
];

const badRequestSignupDescription: IFieldDescription[] = [
  createField(
    'message',
    'Аккаунт уже существует',
    'string',
    'Сообщение об ошибке',
  ),
  createField('statusCode', HttpStatus.CONFLICT, 'number', 'HTTP-статус код'),
  createField(
    'timestamp',
    '2024-02-04T10:41:34.656Z',
    'string',
    'Время возникновения ошибки',
  ),
  createField('path', '/dev/api/signup', 'string', 'Путь возникновения ошибки'),
];

const refreshTokenBodyDescription: IFieldDescription[] = [
  createField(
    'accessToken',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    'string',
    'accessToken по умолчанию действует 1 день',
  ),
  createField(
    'refreshToken',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    'string',
    'refreshToken по умолчанию действует 7 день',
  ),
];

const badRequestRefreshTokeDescription: IFieldDescription[] = [
  createField(
    'message',
    'Невалидный refreshToken',
    'string',
    'Сообщение об ошибке',
  ),
  createField(
    'statusCode',
    HttpStatus.UNAUTHORIZED,
    'number',
    'HTTP-статус код',
  ),
  createField(
    'timestamp',
    '2024-02-04T10:41:34.656Z',
    'string',
    'Время возникновения ошибки',
  ),
  createField(
    'path',
    '/dev/api/refresh-token',
    'string',
    'Путь возникновения ошибки',
  ),
];

const resetPasswordResBodyDescription: IFieldDescription[] = [
  createField(
    'message',
    'Ссылка на сброс пароля отправлена на ваш email: test@mail.ru',
    'string',
    'Сообщение об успешном сбросе пароля',
  ),
];

const badRequestResetPasswordDescription: IFieldDescription[] = [
  createField(
    'message',
    'Пользователь с указанным Email не найден',
    'string',
    'Сообщение об ошибке',
  ),
  createField('statusCode', HttpStatus.NOT_FOUND, 'number', 'HTTP-статус код'),
  createField(
    'timestamp',
    '2024-02-04T10:41:34.656Z',
    'string',
    'Время возникновения ошибки',
  ),
  createField(
    'path',
    '/dev/api/reset-password',
    'string',
    'Путь возникновения ошибки',
  ),
];

const singUpBadRequest: IFieldDescription[] = [
  createField('message', 'Bad Request Exception', 'string', 'Тип ошибки'),
  createField(
    'statusCode',
    HttpStatus.BAD_REQUEST,
    'number',
    'HTTP-статус код',
  ),
  createField(
    'timestamp',
    '2024-02-04T10:41:34.656Z',
    'string',
    'Время возникновения ошибки',
  ),
  createField('path', '/dev/api/signup', 'string', 'Путь возникновения ошибки'),
];

const yandexExchangeBadRequest: IFieldDescription[] = [
  createField(
    'message',
    'Ошибка в процессе авторизации через Яндекс',
    'string',
    'Тип ошибки',
  ),
  createField(
    'statusCode',
    HttpStatus.BAD_REQUEST,
    'number',
    'HTTP-статус код',
  ),
  createField(
    'timestamp',
    '2024-02-04T10:41:34.656Z',
    'string',
    'Время возникновения ошибки',
  ),
  createField(
    'path',
    '/dev/api/yandex/exchange',
    'string',
    'Путь возникновения ошибки',
  ),
];

const mailruExchangeBadRequest: IFieldDescription[] = [
  createField('message', 'Internal Server Error', 'string', 'Тип ошибки'),
  createField(
    'statusCode',
    HttpStatus.INTERNAL_SERVER_ERROR,
    'number',
    'HTTP-статус код',
  ),
  createField(
    'timestamp',
    '2024-02-04T10:41:34.656Z',
    'string',
    'Время возникновения ошибки',
  ),
  createField(
    'path',
    '/dev/api/mailru/exchange',
    'string',
    'Путь возникновения ошибки',
  ),
];

export const SigninResponseBodyOK = new ApiPropertyFactory(
  accountsDescription,
).generate('SigninResponseBodyOK');

export const SigninResponseBodyNotOK = new ApiPropertyFactory(
  badRequestSigninDescription,
).generate('SigninResponseBodyNotOK');

export const SignupResponseBodyNotOK = new ApiPropertyFactory(
  badRequestSignupDescription,
).generate('SignupResponseBodyNotOK');

export const refreshTokenResponseBodyOK = new ApiPropertyFactory(
  refreshTokenBodyDescription,
).generate('refreshTokenResponseBodyOK');

export const refreshTokenResponseBodyNotOK = new ApiPropertyFactory(
  badRequestRefreshTokeDescription,
).generate('refreshTokenResponseBodyNotOK');

export const ResetPasswordResponseBodyOK = new ApiPropertyFactory(
  resetPasswordResBodyDescription,
).generate('ResetPasswordResponseBodyOK');

export const ResetPasswordResponseBodyNotFound = new ApiPropertyFactory(
  badRequestResetPasswordDescription,
).generate('ResetPasswordResponseBodyNotFound');

export const SingUpBadRequest = new ApiPropertyFactory(
  singUpBadRequest,
).generate('SingUpBadRequest');

export const YandexExchangeBadRequest = new ApiPropertyFactory(
  yandexExchangeBadRequest,
).generate('YandexExchangeBadRequest');

export const MailruExchangeBadRequest = new ApiPropertyFactory(
  mailruExchangeBadRequest,
).generate('MailruExchangeBadRequest');
