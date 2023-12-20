import {
  AbilityBuilder,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
  MongoQuery,
  createMongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import Role from 'src/accounts/types/role';
import { CreateTemplateDto } from 'src/bots/dto/create-template.dto';
import { Bot } from 'src/bots/schema/bots.schema';
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
  | 'all'
>;

type PossibleAbilities = [Action, Subjects];
type Conditions = MongoQuery;

export type AppAbility = MongoAbility<PossibleAbilities, Conditions>;

@Injectable()
export class AbilityFactory {
  private getRole(user, soughtRole): boolean {
    return user.accounts.some((account) => account.role === soughtRole);
  }
  //--Функция defineAbility определяет, что может делать пользователь в приложении--//
  defineAbility(user: Profile): AppAbility {
    const isSuperAdmin = this.getRole(user, Role.SUPER_ADMIN);
    const isAdmin = this.getRole(user, Role.ADMIN);
    //--Создаем строитель AbilityBuilder, который поможет нам определить правила доступа--//
    const { can, cannot, build } = new AbilityBuilder(
      createMongoAbility<PossibleAbilities, Conditions>,
    );
    //--Здесь определяем правила доступа--//
    if (isAdmin) {
      //--Администраторы имеют право на действия связанные с чтением профиля--//
      can(Action.Read, Profile);
      //--Администраторы имеют право на все действия связанные с ботами--//
      can(Action.Manage, Bot);
      //--Администраторы НЕ имеют право на любые действия связанные с шаблонами--//
      cannot(Action.Manage, CreateTemplateDto).because(
        'Этот функционал только у супер администратора',
      );
      //--Любые сложные правила не работают--//
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
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
