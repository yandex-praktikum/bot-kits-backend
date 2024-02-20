import { HttpStatus } from '@nestjs/common';
import {
  ApiPropertyFactory,
  IFieldDescription,
  createField,
  createNestedObject,
} from 'src/utils/apiPropertyFactory';

const tariffDescription: IFieldDescription = createNestedObject([
  createField('_id', '65196b9715b55bd51b039144', 'string'),
  createField('name', 'Демо', 'string'),
  createField('price', 0, 'number'),
  createField('botsCount', 10, 'number'),
  createField('subscribersCount', 120, 'number'),
  createField('duration', '0D', 'string'),
  createField('status', true, 'boolean'),
  createField('isStarted', true, 'boolean'),
  createField('isDemo', true, 'boolean'),
]);

const recipientProfile: IFieldDescription = createNestedObject([
  createField('_id', '65196b9715b55bd51b039144', 'string'),
  createField('username', 'name', 'string'),
  createField('phone', '+79001234567', 'string'),
  createField('avatar', 'https://i.pravatar.cc/300', 'string'),
  createField('balance', 0, 'number'),
  createField('referredUsers', [], 'array'),
  createField('visited_ref', 0, 'number'),
  createField('registration_ref', 0, 'number'),
  createField('accounts', ['65cb405ca6d2a27bb1d09750'], 'array'),
  createField(
    'receivedSharedAccess',
    [
      {
        profile: '65c5e2ee219c9bffc85cb696',
        dashboard: true,
        botBuilder: true,
        mailing: false,
        static: false,
      },
    ],
    'array',
  ),
  createField('grantedSharedAccess', [], 'array'),
  createField('promocode', [], 'array'),
  createField('dateRegistration', '2024-02-13T10:09:38.909Z', 'string'),
  createField('lastAccountActivity', '2024-02-13T10:09:38.909Z', 'string'),
  createField('partner_ref', 'e7f8d6a', 'string'),
]);

const grantingProfile: IFieldDescription = createNestedObject([
  createField('_id', '65196b9715b55bd51b039144', 'string'),
  createField('username', 'name', 'string'),
  createField('phone', '+79001234567', 'string'),
  createField('avatar', 'https://i.pravatar.cc/300', 'string'),
  createField('accounts', ['65cb405ca6d2a27bb1d09750'], 'array'),
  createField('balance', 0, 'number'),
  createField('dateRegistration', '2024-02-13T10:09:38.909Z', 'string'),
  createField(
    'grantedSharedAccess',
    [
      {
        profile: '65c5e2ee219c9bffc85cb696',
        dashboard: true,
        botBuilder: true,
        mailing: false,
        static: false,
      },
    ],
    'array',
  ),
  createField('lastAccountActivity', '2024-02-13T10:09:38.909Z', 'string'),
  createField('promocode', [], 'array'),
  createField('receivedSharedAccess', [], 'array'),
  createField('referredUsers', [], 'array'),
  createField('registration_ref', 0, 'number'),
  createField('visited_ref', 0, 'number'),
]);

const credentials: IFieldDescription = createNestedObject([
  createField('email', 'test@test.ru', 'string'),
  createField('accessToken', 'eyJhbGciOiJIUzI1NiIsInR5c', 'string'),
  createField('refreshToken', '+eyJhbGciOiJIUzI1NiIsInR5c', 'string'),
]);

const setSharedNotFoundResponse: IFieldDescription = createNestedObject([
  createField('message', 'Профиль получателя не найден', 'string'),
  createField('error', 'Not Found', 'string'),
  createField('statusCode', HttpStatus.NOT_FOUND, 'number', 'HTTP-статус код'),
]);

const setSharedConflictResponse: IFieldDescription = createNestedObject([
  createField(
    'message',
    'Доступ уже был предоставлен этому пользователю',
    'string',
  ),
  createField('error', 'Conflict', 'string'),
  createField('statusCode', HttpStatus.CONFLICT, 'number', 'HTTP-статус код'),
]);

const profileDescription: IFieldDescription[] = [
  createField('id', '65196b9715b55bd51b039144', 'string'),
  createField('name', 'test', 'string'),
  createField('mail', 'test@test.ru', 'string'),
  createField('phone', '+79999999999', 'string'),
  createField('botCount', 0, 'number'),
  createField('dateRegistration', '2024-02-13T10:09:38.909Z', 'string'),
  createField('lastActivityAccount', '2024-02-13T10:09:38.909Z', 'string'),
  createField('lastActivityBot', '2024-02-13T10:09:38.909Z', 'string'),
  { ...tariffDescription, key: 'tariff' },
  createField('debitDate', '2024-02-13T10:09:38.909Z', 'string'),
];

const userDescription: IFieldDescription[] = [
  createField('_id', '65196b9715b55bd51b039144', 'string'),
  createField('username', 'test', 'string'),
  createField('phone', '+79999999999', 'string'),
  createField('avatar', 'https://i.pravatar.cc/300', 'string'),
  createField('balance', 0, 'number'),
  createField('referredUsers', [], 'array'),
  createField('visited_ref', 0, 'number'),
  createField('registration_ref', 0, 'number'),
  createField('accounts', ['65cb405ca6d2a27bb1d09750'], 'array'),
  createField('receivedSharedAccess', [], 'array'),
  createField('grantedSharedAccess', [], 'array'),
  createField('promocode', [], 'array'),
  createField('dateRegistration', '2024-02-13T10:09:38.909Z', 'string'),
  createField('lastAccountActivity', '2024-02-13T10:09:38.909Z', 'string'),
  createField('partner_ref', 'e7f8d6a', 'string'),
];

const accountsDescription: IFieldDescription[] = [
  createField('_id', '65196b9715b55bd51b039144', 'string'),
  createField('type', 'local', 'string'),
  createField('role', 'admin', 'string'),
  { ...credentials, key: 'credentials' },
  createField('profile', '65196b9715b55bd51b039144', 'string'),
];

const setSharedDescription: IFieldDescription[] = [
  { ...recipientProfile, key: 'recipientProfile' },
  { ...grantingProfile, key: 'grantingProfile' },
];

const sharedDescription: IFieldDescription[] = [
  createField('profile', '65196b9715b55bd51b039144', 'string'),
  createField('dashboard', true, 'boolean'),
  createField('botBuilder', true, 'boolean'),
  createField('mailing', true, 'boolean'),
  createField('static', true, 'boolean'),
];

const profileBadRequestResponse: IFieldDescription[] = [
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
  createField('path', '/dev/api/:path', 'string', 'Путь возникновения ошибки'),
];

const profileUnauthirizedResponse: IFieldDescription[] = [
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
  createField('path', '/dev/api/:path', 'string', 'Путь возникновения ошибки'),
];

const accountsNotFoundResponse: IFieldDescription[] = [
  createField(
    'message',
    'Profile with ID 65cb47257fe616dcd10b335a not found',
    'string',
    'Сообщение об ошибке',
  ),
  createField('statusCode', HttpStatus.NOT_FOUND, 'number', 'HTTP-статус код'),
  createField(
    'timestamp',
    '2024-02-04T12:37:00.127Z',
    'string',
    'Время возникновения ошибки',
  ),
  createField('path', '/dev/api/:path', 'string', 'Путь возникновения ошибки'),
];

const setSharedConflict: IFieldDescription[] = [
  { ...setSharedConflictResponse, key: 'response' },
  createField('status', HttpStatus.CONFLICT, 'number', 'HTTP-статус код'),
  createField('options', {}, 'object'),
  createField(
    'message',
    'Доступ уже был предоставлен этому пользователю',
    'string',
    'Сообщение об ошибке',
  ),
  createField('name', 'ConflictException', 'string'),
];

const setSharedNotFound: IFieldDescription[] = [
  { ...setSharedNotFoundResponse, key: 'response' },
  createField('status', HttpStatus.NOT_FOUND, 'number', 'HTTP-статус код'),
  createField('options', {}, 'object'),
  createField(
    'message',
    'Профиль получателя не найден',
    'string',
    'Сообщение об ошибке',
  ),
  createField('name', 'NotFoundException', 'string'),
];

const resourceIsNotFound: IFieldDescription[] = [
  createField('message', 'Ресурс не найден', 'string', 'Сообщение об ошибке'),
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
  createField('path', '/dev/api/:path', 'string', 'Путь возникновения ошибки'),
];

export const UserProfileResponseBodyOK = new ApiPropertyFactory(
  profileDescription,
).generate('UserProfileResponseBodyOK');

export const UserResponseBodyOK = new ApiPropertyFactory(
  userDescription,
).generate('UserResponseBodyOK');

export const SetSharedDescription = new ApiPropertyFactory(
  setSharedDescription,
).generate('SetSharedDescription');

export const SharedDescription = new ApiPropertyFactory(
  sharedDescription,
).generate('SharedDescription');

export const AccountsDescription = new ApiPropertyFactory(
  accountsDescription,
).generate('AccountsDescription');

export const ProfileUnauthirizedResponse = new ApiPropertyFactory(
  profileUnauthirizedResponse,
).generate('UserUnauthirizedResponse');

export const ProfileBadRequestResponse = new ApiPropertyFactory(
  profileBadRequestResponse,
).generate('ProfileBadRequestResponse');

export const SetSharedNotFound = new ApiPropertyFactory(
  setSharedNotFound,
).generate('SetSharedNotFound');

export const SetSharedConflict = new ApiPropertyFactory(
  setSharedConflict,
).generate('SetSharedConflict');

export const ResourceIsNotFound = new ApiPropertyFactory(
  resourceIsNotFound,
).generate('ResourceIsNotFound');

export const AccountsNotFoundResponse = new ApiPropertyFactory(
  accountsNotFoundResponse,
).generate('AccountsNotFoundResponse');
