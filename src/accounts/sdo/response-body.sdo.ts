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
  createField('success', true, 'boolean'),
];

export const SingleAccountResponseBodyOK = new ApiPropertyFactory(
  accountDescription,
).generate('SingleAccountResponseBodyOK');
