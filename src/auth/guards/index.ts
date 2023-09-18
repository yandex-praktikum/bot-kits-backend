import { JwtGuard } from './jwtAuth.guards';
import { LocalGuard } from './localAuth.guard';
import { YandexGuard } from './yandex.guards';

export const GUARDS = [LocalGuard, JwtGuard, YandexGuard];
