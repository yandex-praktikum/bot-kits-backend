import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Profile } from 'src/profiles/schema/profile.schema';

export const AuthUser = createParamDecorator(
  (data: never, ctx: ExecutionContext): Profile => {
    return ctx.switchToHttp().getRequest().user;
  },
);
