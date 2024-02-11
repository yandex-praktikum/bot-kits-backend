import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbilityFactory } from 'src/ability/ability.factory';
import { ProfilesService } from 'src/profiles/profiles.service';
import { CHECK_ABILITY, RequiredRules } from '../decorators/ability.decorator';
import { ForbiddenError } from '@casl/ability';
//ability.guard.ts
@Injectable()
export class AbilityGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: AbilityFactory,
    private readonly profilesService: ProfilesService,
  ) {}

  // Метод canActivate определяет, может ли пользователь выполнить действие,
  // основываясь на его правах.
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Получаем правила доступа, связанные с текущим действием.
    const rules =
      this.reflector.get<RequiredRules[]>(
        CHECK_ABILITY,
        context.getHandler(),
      ) || [];

    // Получаем запрос из контекста выполнения.
    const request = context.switchToHttp().getRequest();

    // Проверяем, авторизован ли пользователь.
    if (request?.user) {
      // Получаем пользователя и его права доступа.
      const { id } = request.user;
      const user = await this.profilesService.findById(id);
      const ability = await this.caslAbilityFactory.defineAbility(user);
      request.ability = ability;

      try {
        // Для каждого правила проверяем, разрешено ли действие.
        rules.forEach((rule) => {
          ForbiddenError.from(ability).throwUnlessCan(
            rule.action,
            rule.subject,
          );
        });
        // Если все проверки пройдены, возвращаем true.
        return true;
      } catch (e) {
        if (e instanceof ForbiddenError) {
          throw new ForbiddenException(e.message);
        }
        // В случае исключения (например, пользователь не имеет права на действие),
        // возвращаем false.
        return false;
      }
    }

    // Если пользователь не авторизован, возвращаем false.
    return false;
  }
}
