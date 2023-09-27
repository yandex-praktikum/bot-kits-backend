import {
  ApiPropertyFactory,
  IFieldDescription,
  createField,
} from 'src/utils/apiPropertyFactory';

const signInFields: IFieldDescription[] = [
  createField('email', 'test@mail.ru', 'string', 'Почта пользователя', true),
  createField('password', '123', 'string', 'Пароль пользователя', true),
];

const signUpFields: IFieldDescription[] = [
  createField('password', '123', 'string', 'Пароль пользователя', true),
  createField('email', 'test@mail.ru', 'string', 'Email пользователя', true),
  createField(
    'phone',
    '+79999999999',
    'string',
    'Телефонный номер пользователя',
    true,
  ),
  createField('username', 'test', 'string', 'Имя пользователя', true),
];

const refreshTokenfield: IFieldDescription[] = [
  createField(
    'refreshToken',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    'string',
    'Выданный рефреш токен',
    true,
  ),
];

export const SigninRequestBody = new ApiPropertyFactory(signInFields).generate(
  'SignInRequestBody',
);

export const SignupRequestBody = new ApiPropertyFactory(signUpFields).generate(
  'SignUpRequestBody',
);

export const RefreshTokenRequestBody = new ApiPropertyFactory(
  refreshTokenfield,
).generate('RefreshRequestBody');
