import {
  ApiPropertyFactory,
  IFieldDescription,
  createField,
  createNestedObject,
} from 'src/utils/apiPropertyFactory';

const credentialsDescription: IFieldDescription[] = [
  createField('email', 'test@mail.ru', 'string'),
];

const accountDescription: IFieldDescription[] = [
  createField('type', 'local', 'string'),
  createField('role', 'user', 'string'),
  { ...createNestedObject(credentialsDescription), key: 'credentials' },
];

export const AccountUpdateRequestBody = new ApiPropertyFactory(
  accountDescription,
).generate('AccountUpdateRequestBody');
