import {
  AbilityBuilder,
  InferSubjects,
  MongoAbility,
  createMongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import Role from 'src/accounts/types/role';
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
  'Profile' | typeof Profile | Profile | 'Bot' | typeof Bot | Bot | 'all'
>;
export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class AbilityFactory {
  private getRole(user, soughtRole): boolean {
    return user.accounts.some((account) => account.role === soughtRole);
  }
  // Функция defineAbility определяет, что может делать пользователь в приложении.
  // Это основа для настройки прав доступа.
  defineAbility(user: Profile): AppAbility {
    const isSuperAdmin = this.getRole(user, Role.SUPER_ADMIN);
    const isAdmin = this.getRole(user, Role.ADMIN);
    // Создаем строитель AbilityBuilder, который поможет нам определить правила доступа.
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createMongoAbility,
    );
    // Здесь определяем правила доступа.
    if (isAdmin) {
      // Администраторы имеют право на чтение проифля
      can(Action.Read, Profile);
      can(Action.Read, Bot);
      // can(Action.Update, Bot, ['title']).because(
      //   'потому что можно обновлять только своего бота',
      // );
    } else if (isSuperAdmin) {
      // Супер администраторы имеют доступ ко всем операциям в приложении
      can(Action.Manage, 'all');
    } else {
      can(Action.Read, 'all');
    }
    // Возвращаем сформированный набор правил. Это важно, так как без этого
    // мы не сможем использовать эти правила в других частях приложения.
    return build();
  }
}
