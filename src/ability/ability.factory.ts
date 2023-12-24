import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
  MongoQuery,
  createMongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Role from 'src/accounts/types/role';
import { CreateBotDto } from 'src/bots/dto/create-bot.dto';
import { CreateTemplateDto } from 'src/bots/dto/create-template.dto';
import { UpdateBotDto } from 'src/bots/dto/update-bot.dto';
import { Bot, BotDocument } from 'src/bots/schema/bots.schema';
import { Profile } from 'src/profiles/schema/profile.schema';

//ability.factory.ts
export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
  Share = 'share',
}

export type Subjects = InferSubjects<
  | 'Profile'
  | typeof Profile
  | Profile
  | 'Bot'
  | typeof Bot
  | Bot
  | 'CreateTemplateDto'
  | typeof CreateTemplateDto
  | CreateTemplateDto
  | 'UpdateBotDto'
  | typeof UpdateBotDto
  | UpdateBotDto
  | 'CreateBotDto'
  | typeof CreateBotDto
  | CreateBotDto
  | 'all'
>;

type PossibleAbilities = [Action, Subjects];
type Conditions = MongoQuery;

export type AppAbility = MongoAbility<PossibleAbilities, Conditions>;

@Injectable()
export class AbilityFactory {
  constructor(@InjectModel(Bot.name) private botModel: Model<BotDocument>) {}

  private getRole(user, soughtRole): boolean {
    return user.accounts.some((account) => account.role === soughtRole);
  }
  //--Функция defineAbility определяет, что может делать пользователь в приложении--//
  defineAbility(user: Profile): AppAbility {
    const isSuperAdmin = this.getRole(user, Role.SUPER_ADMIN);
    const isAdmin = this.getRole(user, Role.ADMIN);
    //--Создаем строитель AbilityBuilder, который поможет нам определить правила доступа--//
    const { can, cannot, build } = new AbilityBuilder(
      Ability as AbilityClass<
        Ability<
          [
            Action,
            (
              | InferSubjects<typeof this.botModel>
              | typeof CreateBotDto
              | typeof UpdateBotDto
              | 'all'
            ),
          ]
        >
      >,
    );

    //--Здесь определяем правила доступа--//
    if (isAdmin) {
      //--Администраторы имеют право на все действия связанные с ботами--//
      can(Action.Manage, [CreateBotDto, UpdateBotDto]);
      //--Администраторы НЕ имеют право на любые действия связанные с шаблонами--//
      cannot(Action.Manage, CreateTemplateDto).because(
        'Этот функционал только у супер администратора',
      );
      can(Action.Update, this.botModel, { profile: user.id }).because(
        'Вы не можете редактировать не своего бота',
      );
    } else if (isSuperAdmin) {
      //--Супер администраторы имеют доступ ко всем операциям в приложении--//
      can(Action.Manage, 'all');
    } else {
      //--Остальные пользователи платформы имеют право на чтение всего--//
      can(Action.Read, 'all');
    }
    //--Возвращаем сформированный набор правил в гарду--//
    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (object) => {
        return object.constructor as ExtractSubjectType<
          InferSubjects<typeof this.botModel> | 'all'
        >;
      },
    });
  }
}
