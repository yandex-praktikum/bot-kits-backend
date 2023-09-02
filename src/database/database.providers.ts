import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (): Promise<typeof mongoose> => {
      return await mongoose.connect('mongodb://localhost:27017/BotKits');
    },
  },
];
