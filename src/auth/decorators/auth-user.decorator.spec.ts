import { Account, Credentials } from '../../accounts/schema/account.schema';
import Role from 'src/accounts/types/role';
import TypeAccount from 'src/accounts/types/type-account';
import { Access } from 'src/profiles/schema/profile.schema';
import { SharedAccess } from 'src/shared-accesses/schema/sharedAccess.schema';
import { AuthUser } from './auth-user.decorator';
import { ExecutionContext, Controller, Get } from '@nestjs/common';
import { sharedAccessDefault } from '../../shared-accesses/types/types';
import { Profile } from 'src/profiles/schema/profile.schema';
import mongoose from 'mongoose';

jest.mock('src/profiles/schema/profile.schema', () => {
  class MockedProfile {
    username = 'Ivan Ivanov';
    phone = '+79501364578';
    avatar = 'https://i.pravatar.cc/300';
    balance = 1400;
    partner_ref = '0000000';
    visited_ref = 0;
    registration_ref = 0;
    accounts: Account[] = [];
    sharedAccess: SharedAccess = null;
    receivedSharedAccess: Access[] = [];
    grantedSharedAccess: Access[] = [];
  }

  class MockedAccess {
    profile = new mongoose.Types.ObjectId();
    dasboard = true;
    botBuilder = true;
    mailing = true;
    static = true;
  }

  return {
    __esModule: true,
    Profile: MockedProfile,
    Access: MockedAccess,
  };
});

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

jest.mock('src/shared-accesses/schema/sharedAccess.schema', () => {
  class MockedSharedAccess {
    username = 'Ivan Ivanov';
    email = 'test@mail.ru';
    profile = 'profileId';
    permissions = sharedAccessDefault;
  }

  return {
    __esModule: true,
    SharedAccess: MockedSharedAccess,
  };
});

const accessInstance = new Access();

@Controller()
class TestController {
  @Get()
  testMethod(@AuthUser() user: any) {
    return user;
  }
}

describe('AuthUser Decorator', () => {
  it('should extract user object from the execution context', () => {
    const mockUser = new Profile();
    mockUser.username = 'Ivan Ivanov';
    mockUser.phone = '+79501364578';
    mockUser.avatar = 'https://i.pravatar.cc/300';
    mockUser.balance = 1400;
    mockUser.partner_ref = '0000000';
    mockUser.visited_ref = 0;
    mockUser.registration_ref = 0;
    mockUser.accounts = [];
    mockUser.sharedAccess = null;
    mockUser.receivedSharedAccess = [accessInstance];
    mockUser.grantedSharedAccess = [accessInstance];

    const mockRequest = { user: mockUser };

    // Создание мокированного контекста выполнения
    const mockContext: ExecutionContext = {
      switchToHttp: jest.fn().mockImplementation(() => ({
        getRequest: jest.fn().mockReturnValue(mockRequest),
      })),
    } as unknown as ExecutionContext;

    // Создание экземпляра тестового контроллера
    const controller = new TestController();

    // Имитация вызова метода контроллера с мокированным контекстом
    const result = controller.testMethod(
      mockContext.switchToHttp().getRequest().user,
    );

    // Проверка, что метод контроллера возвращает правильный объект пользователя
    expect(result).toEqual(mockUser);
  });
});
