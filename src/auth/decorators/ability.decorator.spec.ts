import { Reflector } from '@nestjs/core';
import { CheckAbility, CHECK_ABILITY } from './ability.decorator';
import { Action } from '../../ability/ability.factory';
import { CreateProfileDto } from '../../profiles/dto/create-profile.dto';
import { CreateTemplateDto } from '../../bots/dto/create-template.dto';
import { UpdateBotDto } from '../../bots/dto/update-bot.dto';
import { CreateBotDto } from '../../bots/dto/create-bot.dto';
import { UpdateProfileDto } from '../../profiles/dto/update-profile.dto';
import { UpdatePlatformDto } from '../../platforms/dto/update-platform.dto';
import { CreatePlatformDto } from '../../platforms/dto/create-platform.dto';
import UpdateNotificationDto from '../../notifications/dto/update-notification.dto';
import { CreateNotificationDto } from '../../notifications/dto/create-notification.dto';

describe('CheckAbility Decorator with Various Subjects', () => {
  it('should work with CreateProfileDto', () => {
    class TestClass {
      @CheckAbility({ action: Action.Read, subject: CreateProfileDto })
      testMethod() {
        /* eslint-disable no-empty-function */
      }
    }

    const reflector = new Reflector();
    const metadata = reflector.get(
      CHECK_ABILITY,
      TestClass.prototype.testMethod,
    );

    expect(metadata).toEqual([
      {
        action: Action.Read,
        subject: CreateProfileDto,
      },
    ]);
  });

  it('should work with CreateTemplateDto', () => {
    class TestClass {
      @CheckAbility({ action: Action.Read, subject: CreateTemplateDto })
      testMethod() {
        /* eslint-disable no-empty-function */
      }
    }

    const reflector = new Reflector();
    const metadata = reflector.get(
      CHECK_ABILITY,
      TestClass.prototype.testMethod,
    );

    expect(metadata).toEqual([
      {
        action: Action.Read,
        subject: CreateTemplateDto,
      },
    ]);
  });

  it('should work with UpdateBotDto', () => {
    class TestClass {
      @CheckAbility({ action: Action.Read, subject: UpdateBotDto })
      testMethod() {
        /* eslint-disable no-empty-function */
      }
    }

    const reflector = new Reflector();
    const metadata = reflector.get(
      CHECK_ABILITY,
      TestClass.prototype.testMethod,
    );

    expect(metadata).toEqual([
      {
        action: Action.Read,
        subject: UpdateBotDto,
      },
    ]);
  });

  it('should work with CreateBotDto', () => {
    class TestClass {
      @CheckAbility({ action: Action.Read, subject: CreateBotDto })
      testMethod() {
        /* eslint-disable no-empty-function */
      }
    }

    const reflector = new Reflector();
    const metadata = reflector.get(
      CHECK_ABILITY,
      TestClass.prototype.testMethod,
    );

    expect(metadata).toEqual([
      {
        action: Action.Read,
        subject: CreateBotDto,
      },
    ]);
  });

  it('should work with UpdateProfileDto', () => {
    class TestClass {
      @CheckAbility({ action: Action.Read, subject: UpdateProfileDto })
      testMethod() {
        /* eslint-disable no-empty-function */
      }
    }

    const reflector = new Reflector();
    const metadata = reflector.get(
      CHECK_ABILITY,
      TestClass.prototype.testMethod,
    );

    expect(metadata).toEqual([
      {
        action: Action.Read,
        subject: UpdateProfileDto,
      },
    ]);
  });
  it('should work with UpdatePlatformDto', () => {
    class TestClass {
      @CheckAbility({ action: Action.Read, subject: UpdatePlatformDto })
      testMethod() {
        /* eslint-disable no-empty-function */
      }
    }

    const reflector = new Reflector();
    const metadata = reflector.get(
      CHECK_ABILITY,
      TestClass.prototype.testMethod,
    );

    expect(metadata).toEqual([
      {
        action: Action.Read,
        subject: UpdatePlatformDto,
      },
    ]);
  });

  it('should work with CreatePlatformDto', () => {
    class TestClass {
      @CheckAbility({ action: Action.Read, subject: CreatePlatformDto })
      testMethod() {
        /* eslint-disable no-empty-function */
      }
    }

    const reflector = new Reflector();
    const metadata = reflector.get(
      CHECK_ABILITY,
      TestClass.prototype.testMethod,
    );

    expect(metadata).toEqual([
      {
        action: Action.Read,
        subject: CreatePlatformDto,
      },
    ]);
  });

  it('should work with UpdateNotificationDto', () => {
    class TestClass {
      @CheckAbility({ action: Action.Read, subject: UpdateNotificationDto })
      testMethod() {
        /* eslint-disable no-empty-function */
      }
    }

    const reflector = new Reflector();
    const metadata = reflector.get(
      CHECK_ABILITY,
      TestClass.prototype.testMethod,
    );

    expect(metadata).toEqual([
      {
        action: Action.Read,
        subject: UpdateNotificationDto,
      },
    ]);
  });

  it('should work with CreateNotificationDto', () => {
    class TestClass {
      @CheckAbility({ action: Action.Read, subject: CreateNotificationDto })
      testMethod() {
        /* eslint-disable no-empty-function */
      }
    }

    const reflector = new Reflector();
    const metadata = reflector.get(
      CHECK_ABILITY,
      TestClass.prototype.testMethod,
    );

    expect(metadata).toEqual([
      {
        action: Action.Read,
        subject: CreateNotificationDto,
      },
    ]);
  });

  it('should work with all', () => {
    class TestClass {
      @CheckAbility({ action: Action.Read, subject: 'all' })
      testMethod() {
        /* eslint-disable no-empty-function */
      }
    }

    const reflector = new Reflector();
    const metadata = reflector.get(
      CHECK_ABILITY,
      TestClass.prototype.testMethod,
    );

    expect(metadata).toEqual([
      {
        action: Action.Read,
        subject: 'all',
      },
    ]);
  });
});
