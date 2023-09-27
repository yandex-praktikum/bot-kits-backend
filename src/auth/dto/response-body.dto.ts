import {
  ApiPropertyFactory,
  IFieldDescription,
  createField,
  createNestedObject,
} from 'src/utils/apiPropertyFactory';

const credentialsDescription: IFieldDescription = createNestedObject([
  createField('email', 'test@mail.ru', 'string'),
  createField('accessToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', 'string'),
  createField('refreshToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', 'string'),
]);

const accountsDescription: IFieldDescription = createNestedObject([
  createField('_id', '650b396ed4201e5ca499f3b5', 'string'),
  createField('type', 'local', 'string'),
  createField('role', 'user', 'string'),
  { ...credentialsDescription, key: 'credentials' },
  createField('profile', '650b396dd4201e5ca499f3b3', 'string'),
]);

const userDescription: IFieldDescription[] = [
  createField('_id', '650b396dd4201e5ca499f3b3', 'string'),
  createField('username', 'test', 'string'),
  createField('phone', '+79999999999', 'string'),
  createField('avatar', 'https://i.pravatar.cc/300', 'string'),
  createField('balance', 0, 'number'),
  {
    key: 'accounts',
    example: [accountsDescription.example],
    type: 'array',
  },
];

const badRequestSigninDescription: IFieldDescription[] = [
  createField(
    'message',
    'Неверное имя пользователя или пароль',
    'string',
    'Сообщение об ошибке',
  ),
  createField('error', 'Unauthorized', 'string', 'Тип ошибки'),
  createField('statusCode', '401', 'number', 'HTTP-статус код'),
];

const badRequestSignupDescription: IFieldDescription[] = [
  createField(
    'message',
    'Аккаунт уже существует',
    'string',
    'Сообщение об ошибке',
  ),
  createField('error', 'Conflict', 'string', 'Тип ошибки'),
  createField('statusCode', '409', 'number', 'HTTP-статус код'),
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
  createField('error', 'Unauthorized', 'string', 'Тип ошибки'),
  createField('statusCode', '401', 'number', 'HTTP-статус код'),
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
  createField('error', 'Not Found', 'string', 'Тип ошибки'),
  createField('statusCode', '404', 'number', 'HTTP-статус код'),
];

export const SigninResponseBodyOK = new ApiPropertyFactory(
  userDescription,
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
