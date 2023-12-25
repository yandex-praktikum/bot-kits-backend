import {
  AbilityBuilder,
  ExtractSubjectType,
  InferSubjects,
  PureAbility,
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
  Copy = 'copy',
  CreateOnlyFromTemplate = 'createOnlyFromTemplate',
}

export type Subjects = InferSubjects<
  typeof CreateTemplateDto | typeof UpdateBotDto | typeof CreateBotDto | 'all'
>;

@Injectable()
export class AbilityFactory {
  constructor(@InjectModel(Bot.name) private botModel: Model<BotDocument>) {}

  private getRole(user, soughtRole): boolean {
    return user.accounts.some((account) => account.role === soughtRole);
  }
  //--Функция defineAbility определяет, что может делать пользователь в приложении--//
  defineAbility(user: Profile): PureAbility {
    type AppAbility = PureAbility<[Action, Subjects | typeof this.botModel]>;

    const isSuperAdmin = this.getRole(user, Role.SUPER_ADMIN);
    const isAdmin = this.getRole(user, Role.ADMIN);
    //--Создаем строитель AbilityBuilder, который поможет нам определить правила доступа--//
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createMongoAbility,
    );

    //--Здесь определяем правила доступа--//
    if (isAdmin) {
      //--Администраторы имеют право на все действия связанные с ботами--//
      can(Action.Manage, [CreateBotDto, UpdateBotDto]);
      //--Администраторы НЕ имеют право на любые действия связанные с шаблонами--//
      cannot(Action.Manage, CreateTemplateDto).because(
        'Этот функционал только у супер администратора',
      );
      can(Action.Update, this.botModel, { profile: user.id });
      can(Action.CreateOnlyFromTemplate, this.botModel, {
        type: 'template',
      });
      can(Action.Copy, this.botModel, { profile: user.id });
    } else if (isSuperAdmin) {
      can(Action.Manage, [CreateBotDto, UpdateBotDto]);
      //--Супер администраторы имеют доступ ко всем операциям в приложении--//
      can(Action.Manage, 'all');
    } else {
      //--Остальные ничего не могут--//
      cannot(Action.Manage, 'all').because('Зарегистрируйтесь');
    }
    //--Возвращаем сформированный набор правил в гарду--//
    return build({
      detectSubjectType: (object) =>
        object.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
