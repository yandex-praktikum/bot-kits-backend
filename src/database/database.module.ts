import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {
  constructor() {
    const mongoose = require('mongoose');
    const connection = mongoose.connection;

    connection.on('connected', () => {
      console.log('Connected to MongoDB');
    });

    connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err}`);
    });

    connection.on('disconnected', () => {
      console.log('Disconnected from MongoDB');
    });
  }
}
