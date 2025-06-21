import { Module } from '@nestjs/common';
import { LocalImageStorageService } from './local-image-storage.service';

@Module({
  providers: [
    {
      provide: 'ImageStorageService',
      useClass: LocalImageStorageService,
    },
  ],
  exports: ['ImageStorageService'],
})
export class StorageModule {}
