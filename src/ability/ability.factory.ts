import {
  AbilityBuilder,
  ExtractSubjectType,
  InferSubjects,
  MatchConditions,
  PureAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Role from 'src/accounts/types/role';
import { CreateBotDto } from 'src/bots/dto/create-bot.dto';
import { CreateTemplateDto } from 'src/bots/dto/create-template.dto';
import { UpdateBotDto } from 'src/bots/dto/update-bot.dto';
import { Bot, BotDocument } from 'src/bots/schema/bots.schema';
import { CreateNotificationDto } from 'src/notifications/dto/create-notification.dto';
import UpdateNotificationDto from 'src/notifications/dto/update-notification.dto';
import { CreatePlatformDto } from 'src/platforms/dto/create-platform.dto';
import { UpdatePlatformDto } from 'src/platforms/dto/update-platform.dto';
import { CreateProfileDto } from 'src/profiles/dto/create-profile.dto';
import { UpdateProfileDto } from 'src/profiles/dto/update-profile.dto';
import { Profile } from 'src/profiles/schema/profile.schema';
import { Statistics } from 'src/statistics/schema/statistics.schema';
import {
  Subscription,
  SubscriptionDocument,
} from 'src/subscriptions/schema/subscription.schema';

//ability.factory.ts
export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
  Share = 'share',
  Copy = 'copy',
  CreateOnlyFromTemplate = 'createOnlyFromTemplate',
}

export type Subjects = InferSubjects<
  | typeof CreateTemplateDto
  | typeof UpdateBotDto
  | typeof CreateBotDto
  | typeof CreateProfileDto
  | typeof UpdateProfileDto
  | typeof UpdatePlatformDto
  | typeof CreatePlatformDto
  | typeof UpdateNotificationDto
  | typeof CreateNotificationDto
  | typeof Statistics
  | 'all'
>;

@Injectable()
export class AbilityFactory {
  private sub: Subscription;
  constructor(
    @InjectModel(Bot.name) private botModel: Model<BotDocument>,
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<SubscriptionDocument>,
  ) {}

  private getRole(user, soughtRole): boolean {
    return user.accounts.some((account) => account.role === soughtRole);
  }

  private async getSub(user): Promise<any> {
    this.sub = await this.subscriptionModel.findOne({
      'profile._id': user._id,
    });
  }

  private async getSubStatus(): Promise<boolean> {
    return this.sub.status;
  }

  private async getBotsLimit(): Promise<number> {
    return this.sub.tariff.botsCount;
  }

  private async getBotsCount(user): Promise<number> {
    return (await this.botModel.find(user)).length;
  }

  //--Функция defineAbility определяет, что может делать пользователь в приложении--//
  async defineAbility(user: Profile): Promise<PureAbility> {
    type AppAbility = PureAbility<[Action, Subjects | typeof this.botModel]>;
    const lambdaMatcher = (matchConditions: MatchConditions) => matchConditions;

    const isSuperAdmin = this.getRole(user, Role.SUPER_ADMIN);
    const isAdmin = this.getRole(user, Role.ADMIN);

    //--Инициализируем текущую подписку пользователя--//
    await this.getSub(user);

    //--Создаем строитель AbilityBuilder, который поможет нам определить правила доступа--//
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(PureAbility);

    //--Здесь определяем правила доступа--//
    if (isAdmin) {
      cannot(Action.Manage, Statistics).because(
        'Этот функционал только у супер администратора',
      );

      //--Администраторы могут делать запросы по эндпоинтам связанные с профилем--//
      can(Action.Manage, UpdateProfileDto);
      //--Администраторы НЕ могут удалять чужие профиля и получать к ним доступ--//
      cannot(Action.Manage, CreateProfileDto).because(
        'Этот функционал только у супер администратора',
      );

      //--Администраторы могут только получать платформы--//
      can(Action.Read, UpdatePlatformDto);
      //--Администраторы НЕ могут удалять, обновлять и создавать платформы--//
      cannot(Action.Manage, CreatePlatformDto).because(
        'Этот функционал только у супер администратора',
      );

      //--Администраторы могут только создавать уведомления--//
      can([Action.Read, Action.Update], UpdateNotificationDto);
      //--Администраторы НЕ могут удалять, изменять и получать уведомления--//
      cannot(Action.Manage, CreateNotificationDto).because(
        'Этот функционал только у супер администратора',
      );

      //--Администраторы НЕ имеют право на любые действия связанные с шаблонами--//
      cannot(Action.Manage, CreateTemplateDto).because(
        'Этот функционал только у супер администратора',
      );

      //--Администраторы могут делать запросы по эндпоинтам связанные с ботами--//
      can([Action.Share, Action.Read, Action.Delete], [CreateBotDto]);

      //--Администраторы могут удалять бота если они его создатели--//
      can(Action.Delete, this.botModel, ({ profile }) =>
        profile.equals(user._id),
      );

      //проверяем есть ли у пользователя активная подписка
      if (await this.getSubStatus()) {
        //--Администраторы могут обновлять бота--//
        can(Action.Update, UpdateBotDto);

        //--Администраторы могут обновлять бота если они его создатели и если им был предоставлен общий доступ--//
        can(Action.Update, this.botModel, (bot: Bot) => {
          return (
            bot.profile.equals(user._id) ||
            user.receivedSharedAccess.some((access) => {
              //--Создаем объект с пришедшими правами для сравнения--//
              const comparisonObject = {
                ...bot.permission,
                profile: bot.profile._id,
              };
              //--Сравниваем объект выданных прав с пришедшими в запросе--//
              return Object.keys(comparisonObject).every((key) => {
                return (
                  access[key].toString() === comparisonObject[key].toString()
                );
              });
            })
          );
        });

        //--Администраторы могут создавать бота только из шаблонов--//
        can(
          Action.CreateOnlyFromTemplate,
          this.botModel,
          ({ type }) => type === 'template',
        );

        //проверяем лимит создания ботов по тарифу
        if ((await this.getBotsLimit()) > (await this.getBotsCount(user))) {
          //--Администраторы могут копировать бота если они его создатели--//
          can(Action.Copy, this.botModel, ({ profile }) =>
            profile.equals(user._id),
          );

          //--Администраторы могут создать бота--//
          can([Action.Create], [CreateBotDto]);
        }
      } else {
        cannot(
          [Action.Copy, Action.Create],
          [CreateBotDto, UpdateBotDto],
        ).because('Оформите подписку');
      }
    } else if (isSuperAdmin) {
      //--Супер администраторы имеют доступ ко всем операциям в приложении--//
      can(Action.Manage, 'all');
    } else {
      //--Остальные ничего не могут--//
      cannot(Action.Manage, 'all').because('Зарегистрируйтесь');
    }

    //--Возвращаем сформированный набор правил в гарду--//
    return build({
      conditionsMatcher: lambdaMatcher,
      detectSubjectType: (object) =>
        object.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
