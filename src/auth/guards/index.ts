import { GoogleGuard } from './google.guard';
import { JwtGuard } from './jwtAuth.guards';
import { LocalGuard } from './localAuth.guard';
import { VkontakteGuard } from './vkontakte.guards';
import { YandexGuard } from './yandex.guards';

export const GUARDS = [
  LocalGuard,
  JwtGuard,
  YandexGuard,
  GoogleGuard,
  VkontakteGuard,
];
