import 'reflect-metadata';
import { validate } from 'class-validator';
import { AuthDto } from './auth.dto';
import { CreateProfileDto } from 'src/profiles/dto/create-profile.dto';
import { CreateAccountDto } from 'src/accounts/dto/create-account.dto';
import { Account, Credentials } from 'src/accounts/schema/account.schema';
import TypeAccount from '../../accounts/types/type-account';
import Role from '../../accounts/types/role';

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
const account = new Account();

// Мокируем CreateProfileDto и CreateAccountDto
jest.mock('src/profiles/dto/create-profile.dto', () => {
  class MockedCreateProfileDto {
    username = 'Ivan Ivanov';
    phone = '+79501364578';
    avatar = 'https://i.pravatar.cc/300';
    balance = 1400;
    accounts = [account];
    sharedAccess = '64f9ac26edb84d7ebf6281d0';
    partner_ref = '0000000';
    visited_ref = 0;
    registration_ref = 0;
  }
  return {
    __esModule: true,
    CreateProfileDto: MockedCreateProfileDto,
  };
});

jest.mock('src/accounts/dto/create-account.dto', () => {
  class MockedCreateAccountDto {
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
    CreateAccountDto: MockedCreateAccountDto,
  };
});

describe('AuthDto', () => {
  it('should be valid with valid data', async () => {
    // Создаем фейковые объекты для profileData и accountData
    const profileData = new CreateProfileDto();
    const accountData = new CreateAccountDto();

    const authDto = new AuthDto();
    authDto.profileData = profileData;
    authDto.accountData = accountData;

    const errors = await validate(authDto);
    if (errors.length > 0) {
      console.log(errors);
    }

    expect(errors.length).toBe(0);
  });

  it('should not be valid with invalid data', async () => {
    // Создаем фейковые объекты с недопустимыми данными для profileData и accountData
    const profileData = new CreateProfileDto();
    profileData.username = '1';
    const accountData = new CreateAccountDto();
    accountData.credentials = {
      email: 'example',
      password: 'p',
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    };

    const authDto = new AuthDto();
    authDto.profileData = profileData;
    authDto.accountData = accountData;

    const errors = await validate(authDto);
    console.log(errors);

    expect(errors.length).toBeGreaterThan(0);
  });
});
