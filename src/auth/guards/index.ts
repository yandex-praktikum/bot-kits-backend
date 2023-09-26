import { GoogleGuard } from './google.guard';
import { JwtGuard } from './jwtAuth.guards';
import { LocalGuard } from './localAuth.guard';

export const GUARDS = [LocalGuard, JwtGuard, GoogleGuard];
