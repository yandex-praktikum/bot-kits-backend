import { CreateProfileDto } from './create-profile.dto';
import { validate } from 'class-validator';
import TypeAccount from '../../accounts/types/type-account';
import Role from '../../accounts/types/role';
import { Account, Credentials } from 'src/accounts/schema/account.schema';

// Создаем мок для класса Account
jest.mock('src/accounts/schema/account.schema', () => {
  class MockedAccount {
    type: TypeAccount = TypeAccount.LOCAL;
    role: Role = Role.USER;
    credentials: Credentials = {
      email: 'example@example.com',
      password: 'password',
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    };
    profile = 'profileId';
  }

  return {
    __esModule: true,
    Account: MockedAccount,
  };
});

describe('CreateProfileDto', () => {
  it('should be valid with valid data', async () => {
    const dto = new CreateProfileDto();
    dto.username = 'Ivan Ivanov';
    dto.phone = '+79501364578';
    dto.avatar = 'https://i.pravatar.cc/300';
    dto.balance = 1400;
    const account = new Account();
    dto.accounts = [account];
    dto.sharedAccess = '64f9ac26edb84d7ebf6281d0';
    dto.partner_ref = '0000000';
    dto.visited_ref = 0;
    dto.registration_ref = 0;

    const errors = await validate(dto);
    if (errors.length > 0) {
      console.log(errors);
    }

    expect(errors.length).toBe(0);
  });

  it('should not be valid with invalid data', async () => {
    const dto = new CreateProfileDto();
    dto.username = '1';
    dto.phone = 'hello';
    dto.avatar = '';
    dto.balance = 1400;
    dto.accounts = [];
    dto.sharedAccess = '64f9ac26edb84d7ebf6281d0';
    dto.partner_ref = '0000000';
    dto.visited_ref = 0;
    dto.registration_ref = 0;

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
  });

  it('should not be valid without required properties', async () => {
    const dto = new CreateProfileDto();
    dto.username = '';
    dto.phone = '';
    dto.avatar = 'https://i.pravatar.cc/300';
    dto.balance = 1400;
    dto.accounts = [];
    dto.sharedAccess = '64f9ac26edb84d7ebf6281d0';
    dto.partner_ref = '0000000';
    dto.visited_ref = 0;
    dto.registration_ref = 0;
    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
  });
});
