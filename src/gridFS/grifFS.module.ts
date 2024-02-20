import { Module } from '@nestjs/common';

import { FilesBucketService } from './gridFS.service';

@Module({
  imports: [],
  controllers: [],
  providers: [FilesBucketService],
  exports: [FilesBucketService],
})
export class GridFSModule {}
