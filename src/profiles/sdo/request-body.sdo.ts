import {
  ApiPropertyFactory,
  IFieldDescription,
  createField,
} from 'src/utils/apiPropertyFactory';

const updateProfile: IFieldDescription[] = [
  createField('username', 'name', 'string'),
  createField('phone', '+79501364578', 'string'),
  createField('avatar', 'https://i.pravatar.cc/300', 'string'),
  createField('balance', 1400, 'number'),
  createField('accounts', [], 'array'),
  createField('sharedAccess', '64f9ac26edb84d7ebf6281d0', 'string'),
  createField('partner_ref', 'asfadsfadsf', 'string'),
  createField('visited_ref', 0, 'number'),
  createField('registration_ref', 0, 'number'),
];

export const UpdateProfile = new ApiPropertyFactory(updateProfile).generate(
  'UpdateProfile',
);
