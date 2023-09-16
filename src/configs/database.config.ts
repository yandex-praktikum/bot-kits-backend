import {
  MongooseModuleAsyncOptions,
  MongooseModuleOptions,
} from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

const databaseOptions = (
  configService: ConfigService,
): MongooseModuleOptions => ({
  uri: `mongodb://${configService.get('DB_HOST')}:${configService.get(
    'DB_PORT',
  )}/${configService.get('DB_NAME')}`,
});

export const databaseConfig = (): MongooseModuleAsyncOptions => ({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => databaseOptions(configService),
});
