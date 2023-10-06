import { GoogleGuard } from './google.guard';
import { JwtGuard } from './jwtAuth.guards';
import { LocalGuard } from './localAuth.guard';
import { TelegramGuard } from './telegram.guard';
import { VkontakteGuard } from './vkontakte.guards';

export const GUARDS = [
  LocalGuard,
  JwtGuard,
  GoogleGuard,
  VkontakteGuard,
  TelegramGuard,
];
