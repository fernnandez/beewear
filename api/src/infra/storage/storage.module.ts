import { Module } from '@nestjs/common';
import { LocalImageStorageService } from './local-image-storage.service';

@Module({
  providers: [
    {
      provide: 'ImageStorageService',
      // TODO: usar useFactory para determinar implementação com base no env
      useClass: LocalImageStorageService,
    },
  ],
  exports: ['ImageStorageService'],
})
export class StorageModule {}
