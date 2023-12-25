import { SetMetadata } from '@nestjs/common';
import { Action, Subjects } from '../../ability/ability.factory';
import { Profile } from 'src/profiles/schema/profile.schema';

//ability.decorator.ts
// Определение интерфейса RequiredRules.
// Этот интерфейс используется для описания правил, которые определяют,
// какие действия может выполнять пользователь в отношении определенных сущностей.
export interface RequiredRules {
  action: Action; // 'action' описывает тип действия, например, 'create', 'read' и т.д.
  subject: Subjects; // 'subject' указывает на сущность, к которой применяется действие, например, 'Profile'.
}

// Константа CHECK_ABILITY используется как ключ для хранения метаданных.
// В данном случае, она будет использоваться для хранения правил доступа.
export const CHECK_ABILITY = 'check_ability';

// Функция CheckAbility представляет собой декоратор.
// Этот декоратор принимает массив правил (RequiredRules) и применяет их
// к определенному методу или классу с помощью метаданных.
// Эти правила затем используются в Guard'ах для проверки прав доступа.
export const CheckAbility = (...requirements: RequiredRules[]) =>
  // SetMetadata - функция NestJS, которая позволяет установить метаданные
  // для класса или метода. Здесь она используется для установки правил доступа.
  SetMetadata(CHECK_ABILITY, requirements);

// export class ReadUserAbility implements RequiredRules {
//   action: Action.Read;
//   subject: Profile;
// }
