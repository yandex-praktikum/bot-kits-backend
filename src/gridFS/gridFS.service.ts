import { Injectable } from '@nestjs/common';
import { GridFSBucket } from 'mongodb';
import { InjectConnection } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Injectable()
export class FilesBucketService {
  private filesBucket: GridFSBucket;

  constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {
    this.filesBucket = new GridFSBucket(this.connection.db, {
      bucketName: 'Bucket',
    });
  }

  getBucket() {
    return this.filesBucket;
  }
}
