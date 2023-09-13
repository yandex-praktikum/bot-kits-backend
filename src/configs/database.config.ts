import {
  MongooseModuleAsyncOptions,
  MongooseModuleOptions,
} from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

const databaseOptions = (
  configService: ConfigService,
): MongooseModuleOptions => ({
  uri: `mongodb://${configService.get('DbHost')}:${configService.get(
    'DbPort',
  )}/${configService.get('DbName')}`,
});

export const databaseConfig = (): MongooseModuleAsyncOptions => ({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => databaseOptions(configService),
});
