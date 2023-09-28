import { GoogleGuard } from './google.guard';
import { JwtGuard } from './jwtAuth.guards';
import { LocalGuard } from './localAuth.guard';
import { VkontakteGuard } from './vkontakte.guards';

export const GUARDS = [
  LocalGuard,
  JwtGuard,
  GoogleGuard,
  VkontakteGuard,
];
