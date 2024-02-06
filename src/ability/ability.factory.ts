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
import { BotsService } from 'src/bots/bots.service';
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
import { Subscription } from 'src/subscriptions/schema/subscription.schema';
import { SubscriptionsService } from 'src/subscriptions/subscriptions.service';
import { Tariff } from 'src/tariffs/schema/tariff.schema';
import { TariffsService } from 'src/tariffs/tariffs.service';

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
  | 'all'
>;

@Injectable()
export class AbilityFactory {
  constructor(
    @InjectModel(Bot.name) private botModel: Model<BotDocument>,
    private readonly subscriptionsService: SubscriptionsService,
    private readonly tariffsService: TariffsService,
    private readonly botsService: BotsService,
  ) {}

  private getRole(user, soughtRole): boolean {
    return user.accounts.some((account) => account.role === soughtRole);
  }

  private async getSub(user): Promise<Subscription> {
    const subs = await this.subscriptionsService.findAll();
    return subs.find((sub) => (sub.profile._id = user._id));
  }

  private async getSubStatus(user): Promise<boolean> {
    return (await this.getSub(user)).status;
  }

  private async getUserTariff(user): Promise<Tariff> {
    const tariff = await this.tariffsService.findOne(
      (
        await this.getSub(user)
      ).tariff._id,
    );
    return tariff;
  }

  private async getBotsLimit(user): Promise<number> {
    return (await this.getUserTariff(user)).botsCount;
  }

  private async getBotsCount(user): Promise<number> {
    return (await this.botsService.findAllByUser(user)).length;
  }

  //--Функция defineAbility определяет, что может делать пользователь в приложении--//
  async defineAbility(user: Profile): Promise<PureAbility> {
    type AppAbility = PureAbility<[Action, Subjects | typeof this.botModel]>;
    const lambdaMatcher = (matchConditions: MatchConditions) => matchConditions;

    const isSuperAdmin = this.getRole(user, Role.SUPER_ADMIN);
    const isAdmin = this.getRole(user, Role.ADMIN);
    //--Создаем строитель AbilityBuilder, который поможет нам определить правила доступа--//
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(PureAbility);

    //--Здесь определяем правила доступа--//
    if (isAdmin) {
      //--Администраторы могут делать запросы по эндпоинтам связанные с профилем--//
      can(Action.Manage, UpdateProfileDto);
      //--Администраторы НЕ могут удалять чужие профиля и получать к ним доступ--//
      cannot(Action.Manage, CreateProfileDto);

      //--Администраторы могут только получать платформы--//
      can(Action.Read, UpdatePlatformDto);
      //--Администраторы НЕ могут удалять, обновлять и создавать платформы--//
      cannot(Action.Manage, CreatePlatformDto);

      //--Администраторы могут только создавать уведомления--//
      can(Action.Create, UpdateNotificationDto);
      //--Администраторы НЕ могут удалять, изменять и получать уведомления--//
      cannot(Action.Manage, CreateNotificationDto);

      //--Администраторы НЕ имеют право на любые действия связанные с шаблонами--//
      cannot(Action.Manage, CreateTemplateDto).because(
        'Этот функционал только у супер администратора',
      );

      //проверяем есть ли у пользователя активная подписка
      if (await this.getSubStatus(user)) {
        //проверяем лимит создания ботов по тарифу
        if ((await this.getBotsLimit(user)) > (await this.getBotsCount(user))) {
          //--Администраторы могут копировать бота если они его создатели--//
          can(Action.Copy, this.botModel, ({ profile }) =>
            profile.equals(user._id),
          );

          //--Администраторы могут создать бота--//
          can(Action.Create, [CreateBotDto]);

          //--Администраторы могут создавать бота только из шаблонов--//
          can(
            Action.CreateOnlyFromTemplate,
            this.botModel,
            ({ type }) => type === 'template',
          );
        }

        //--Администраторы могут делать запросы по эндпоинтам связанные с ботами--//
        can([Action.Share, Action.Read], [CreateBotDto]);

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

        //--Администраторы могут удалять бота если они его создатели--//
        can(Action.Delete, this.botModel, ({ profile }) =>
          profile.equals(user._id),
        );
      } else {
        cannot(Action.Manage, [CreateBotDto, UpdateBotDto, CreateTemplateDto]);
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
